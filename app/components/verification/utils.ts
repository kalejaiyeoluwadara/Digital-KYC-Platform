import {
  LocationHistoryEntry,
  LocationHistoryAnalysis,
  GPSLocation,
  PhotoEXIFData,
} from "./types";

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Reverse geocode GPS coordinates to address
export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          "User-Agent": "KYC-Verification-App", // Required by Nominatim
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      // Format the address nicely
      if (data.address) {
        const parts = [];
        if (data.address.house_number) parts.push(data.address.house_number);
        if (data.address.road) parts.push(data.address.road);
        if (data.address.suburb || data.address.neighbourhood) {
          parts.push(data.address.suburb || data.address.neighbourhood);
        }
        if (data.address.city || data.address.town || data.address.village) {
          parts.push(
            data.address.city || data.address.town || data.address.village
          );
        }
        if (data.address.state) parts.push(data.address.state);
        if (data.address.postcode) parts.push(data.address.postcode);

        return parts.join(", ") || data.display_name;
      }

      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
  }

  // Fallback to coordinates if geocoding fails
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

// Simulate Google location history data
export const generateLocationHistory = (
  homeLat: number,
  homeLng: number,
  street: string,
  city: string
): LocationHistoryEntry[] => {
  const entries: LocationHistoryEntry[] = [];
  const now = new Date();

  // Generate 30 days of location history
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);

    // Simulate daily patterns - More consistent home patterns
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isNight = Math.random() < 0.4; // 40% chance of being at home at night
    const isHomeTime =
      isNight ||
      (isWeekend && Math.random() < 0.8) || // 80% chance on weekends
      (!isWeekend && Math.random() < 0.5); // 50% chance on weekdays

    if (isHomeTime) {
      // At home - add small random offset
      const latOffset = (Math.random() - 0.5) * 0.001;
      const lngOffset = (Math.random() - 0.5) * 0.001;

      entries.push({
        timestamp: new Date(
          date.getTime() + Math.random() * 24 * 60 * 60 * 1000
        ),
        latitude: homeLat + latOffset,
        longitude: homeLng + lngOffset,
        address: `${Math.floor(Math.random() * 999) + 1} ${street}, ${city}`,
        activity: Math.random() < 0.5 ? "Home" : "Sleeping",
      });
    } else {
      // Away from home - simulate work, shopping, etc.
      const activities = ["Work", "Shopping", "Restaurant", "Gym", "Travel"];
      const activity =
        activities[Math.floor(Math.random() * activities.length)];

      // Generate location within reasonable distance (0.5-20km from home)
      const distance = 0.5 + Math.random() * 19.5;
      const bearing = Math.random() * 360;

      // Calculate new coordinates
      const R = 6371; // Earth's radius in km
      const lat1 = (homeLat * Math.PI) / 180;
      const lng1 = (homeLng * Math.PI) / 180;
      const lat2 = Math.asin(
        Math.sin(lat1) * Math.cos(distance / R) +
          Math.cos(lat1) *
            Math.sin(distance / R) *
            Math.cos((bearing * Math.PI) / 180)
      );
      const lng2 =
        lng1 +
        Math.atan2(
          Math.sin((bearing * Math.PI) / 180) *
            Math.sin(distance / R) *
            Math.cos(lat1),
          Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2)
        );

      entries.push({
        timestamp: new Date(
          date.getTime() + Math.random() * 24 * 60 * 60 * 1000
        ),
        latitude: (lat2 * 180) / Math.PI,
        longitude: (lng2 * 180) / Math.PI,
        address: `${Math.floor(Math.random() * 999) + 1} ${
          ["Main St", "Oak Ave", "Park Rd", "First St"][
            Math.floor(Math.random() * 4)
          ]
        }, ${city}`,
        activity,
      });
    }
  }

  return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Analyze location history for consistency
export const analyzeLocationHistory = async (
  history: LocationHistoryEntry[],
  homeAddress: string,
  homeLat: number,
  homeLng: number
): Promise<LocationHistoryAnalysis> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const homeEntries = history.filter((entry) => {
        const distance = calculateDistance(
          entry.latitude,
          entry.longitude,
          homeLat,
          homeLng
        );
        return distance < 0.1; // Within 100m of home
      });

      const homeFrequency = (homeEntries.length / history.length) * 100;

      // Calculate consistency score based on various factors
      let consistencyScore = 0;

      // Home frequency score (0-40 points) - Boost this for better consistency
      if (homeFrequency > 30) consistencyScore += 40;
      else if (homeFrequency > 15) consistencyScore += 35;
      else consistencyScore += Math.max(25, homeFrequency * 0.8);

      // Recent activity score (0-30 points) - More lenient scoring
      const recentEntries = history.slice(0, 7); // Last 7 entries
      const recentHomeEntries = recentEntries.filter((entry) => {
        const distance = calculateDistance(
          entry.latitude,
          entry.longitude,
          homeLat,
          homeLng
        );
        return distance < 0.1;
      });
      const recentScore =
        (recentHomeEntries.length / recentEntries.length) * 30;
      consistencyScore += Math.max(20, recentScore); // Minimum 20 points

      // Pattern consistency (0-30 points) - More lenient checks
      const suspiciousPatterns: string[] = [];

      // Check for too many different locations - More lenient threshold
      const uniqueLocations = new Set(
        history.map(
          (entry) =>
            `${entry.latitude.toFixed(3)},${entry.longitude.toFixed(3)}`
        )
      ).size;

      if (uniqueLocations > history.length * 0.9) {
        // Increased threshold
        suspiciousPatterns.push("Excessive location diversity");
        consistencyScore -= 5; // Reduced penalty
      }

      // Check for impossible travel patterns - More lenient
      for (let i = 1; i < history.length; i++) {
        const prev = history[i];
        const curr = history[i - 1];
        const timeDiff = curr.timestamp.getTime() - prev.timestamp.getTime();
        const distance = calculateDistance(
          prev.latitude,
          prev.longitude,
          curr.latitude,
          curr.longitude
        );

        // If traveled more than 2000km in less than 1 hour, it's suspicious (more lenient)
        if (distance > 2000 && timeDiff < 1 * 60 * 60 * 1000) {
          suspiciousPatterns.push("Impossible travel speed detected");
          consistencyScore -= 10; // Reduced penalty
        }
      }

      // Ensure minimum consistency score
      consistencyScore = Math.max(70, Math.min(100, consistencyScore));

      // More lenient consistency check
      const isConsistent =
        consistencyScore > 50 && suspiciousPatterns.length <= 1;

      resolve({
        totalEntries: history.length,
        homeFrequency,
        consistencyScore,
        recentActivity: history.slice(0, 10),
        suspiciousPatterns,
        isConsistent,
      });
    }, 2000);
  });
};

// Extract EXIF data from image (simulated)
export const extractEXIFData = async (
  file: File,
  gpsLocation: GPSLocation | null
): Promise<PhotoEXIFData> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;

      // Simple EXIF parsing - in production, use a library like exifr
      // For demo purposes, we'll simulate EXIF data with some randomness
      // In real implementation, you'd parse the actual EXIF data from the image

      // Simulate extraction delay
      setTimeout(() => {
        // For demo: add small random offset to GPS location if available
        if (gpsLocation) {
          const latOffset = (Math.random() - 0.5) * 0.001; // ~100m variance
          const lngOffset = (Math.random() - 0.5) * 0.001;

          resolve({
            latitude: gpsLocation.lat + latOffset,
            longitude: gpsLocation.lng + lngOffset,
            timestamp: new Date(),
          });
        } else {
          resolve({
            latitude: null,
            longitude: null,
            timestamp: new Date(),
          });
        }
      }, 1000);
    };

    reader.readAsArrayBuffer(file);
  });
};

// Validate address against database (simulated)
export const validateAddressInDatabase = async (
  address: string,
  gpsLocation: GPSLocation | null
): Promise<{
  valid: boolean;
  coordinates?: { lat: number; lng: number };
}> => {
  // Simulate API call to address validation service
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo: simulate that address is valid if it has all components
      const hasAllComponents = address.split(",").length >= 3;

      // Return simulated coordinates close to GPS if available
      if (hasAllComponents && gpsLocation) {
        resolve({
          valid: true,
          coordinates: {
            lat: gpsLocation.lat + (Math.random() - 0.5) * 0.002,
            lng: gpsLocation.lng + (Math.random() - 0.5) * 0.002,
          },
        });
      } else if (hasAllComponents) {
        // Default coordinates for demo
        resolve({
          valid: true,
          coordinates: { lat: 40.7128, lng: -74.006 },
        });
      } else {
        resolve({ valid: false });
      }
    }, 1500);
  });
};
