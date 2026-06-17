"use client";

export interface UtmData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  timestamp: number;
  is_organic?: boolean;
  referrer_domain?: string;
}

const ATTRIBUTION_WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const STORAGE_KEY = "zenvora_utm_data";
const SESSION_KEY = "zenvora_session_id";

// Helper to generate a simple unique session ID
function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = "sess_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

// Get clean active UTM data if not expired
export function getUtmData(): UtmData | null {
  if (typeof window === "undefined") return null;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const data: UtmData = JSON.parse(stored);
    const age = Date.now() - data.timestamp;
    
    if (age < ATTRIBUTION_WINDOW_MS) {
      return data;
    } else {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  } catch (e) {
    console.error("Failed to parse UTM data from localStorage", e);
    return null;
  }
}

// Store UTM data in localStorage
export function setUtmData(data: Omit<UtmData, "timestamp">) {
  if (typeof window === "undefined") return;
  const payload: UtmData = {
    ...data,
    timestamp: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

// Clear UTM data from storage after purchase
export function clearUtmData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

// Initialize UTM and Referrer Capture
export function initializeUtm(searchParams: URLSearchParams) {
  if (typeof window === "undefined") return;

  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
  const utmData: Record<string, string> = {};
  let hasUtm = false;

  utmKeys.forEach((key) => {
    const val = searchParams.get(key);
    if (val) {
      utmData[key] = val;
      hasUtm = true;
    }
  });

  if (hasUtm) {
    // Save to LocalStorage (Overwrites previous campaigns - Last Touch Attribution)
    setUtmData({
      utm_source: utmData.utm_source,
      utm_medium: utmData.utm_medium,
      utm_campaign: utmData.utm_campaign,
      utm_term: utmData.utm_term,
      utm_content: utmData.utm_content,
      is_organic: false,
    });
    
    // Log a page_view event for the campaign click
    trackEvent("page_view", { type: "campaign_click" });
  } else {
    // If no UTM parameter is in the URL, check if we should attribute to an organic referrer
    const referrer = document.referrer;
    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);
        const currentUrl = new URL(window.location.href);

        // Make sure referrer is not our own website domain
        if (referrerUrl.hostname !== currentUrl.hostname) {
          // Check if there is already a valid UTM campaign stored (don't overwrite campaigns with organic visits)
          const existingUtm = getUtmData();
          if (!existingUtm || existingUtm.is_organic) {
            let source = referrerUrl.hostname.replace("www.", "");
            let medium = "referral";
            let campaign = "organic_referrer";

            // Categorize common sources
            if (source.includes("google") || source.includes("bing") || source.includes("yahoo")) {
              medium = "organic";
              campaign = "organic_search";
              source = source.split(".")[0];
            } else if (source.includes("facebook") || source.includes("instagram") || source.includes("t.co") || source.includes("twitter") || source.includes("pinterest") || source.includes("linkedin")) {
              medium = "social";
              campaign = "organic_social";
              if (source.includes("t.co") || source.includes("twitter")) source = "twitter";
              else source = source.split(".")[0];
            }

            setUtmData({
              utm_source: source,
              utm_medium: medium,
              utm_campaign: campaign,
              is_organic: true,
              referrer_domain: referrerUrl.hostname,
            });
            
            trackEvent("page_view", { type: "organic_referral" });
          }
        }
      } catch (err) {
        console.error("Failed to parse referrer URL", err);
      }
    }
  }
}

// Log GA4-style analytics event
export async function trackEvent(
  eventName: "page_view" | "view_item" | "add_to_cart" | "begin_checkout" | "purchase",
  metadata?: Record<string, any>
) {
  if (typeof window === "undefined") return;

  const utm = getUtmData();
  const sessionId = getOrCreateSessionId();

  // 1. Log to our custom DB
  const eventPayload = {
    eventName,
    utmCampaign: utm?.utm_campaign || null,
    utmSource: utm?.utm_source || null,
    utmMedium: utm?.utm_medium || null,
    sessionValue: sessionId,
    metadata: metadata || null,
  };

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    
    // We send this in the background using fetch
    fetch(`${API_URL}/dashboard/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventPayload),
    }).catch((e) => console.error("Error sending analytics event to database", e));
  } catch (err) {
    console.error("Failed to fetch API url for analytics event", err);
  }

  // 2. Google Analytics (GA4) Integration
  // Pushes to window.gtag if Gtag/GA4 is initialized on the client browser
  if (typeof window !== "undefined" && (window as any).gtag) {
    try {
      (window as any).gtag("event", eventName, {
        session_id: sessionId,
        utm_source: utm?.utm_source || "(direct)",
        utm_medium: utm?.utm_medium || "(none)",
        utm_campaign: utm?.utm_campaign || "(direct)",
        utm_term: utm?.utm_term,
        utm_content: utm?.utm_content,
        ...metadata,
      });
      console.debug(`[GA4 Event] ${eventName}`, metadata);
    } catch (gaErr) {
      console.error("Error pushing event to Google Analytics GA4", gaErr);
    }
  }
}
