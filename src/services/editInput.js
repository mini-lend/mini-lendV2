import { formatEther, formatUnits, parseEther, parseUnits } from 'viem';

/**
 * Smart value resolver that handles various input types
 */
export const resolveValue = {
  /**
   * Converts any value to a human-readable string
   */
  toHumanReadable: (value, decimals = 18) => {
    // Handle null/undefined
    if (value === null || value === undefined || value === "") {
      return "0";
    }

    try {
      // BigInt
      if (typeof value === "bigint") {
        return formatUnits(value, decimals);
      }

      // Number
      if (typeof value === "number") {
        // If it's a large number (likely in wei)
        if (value > 1e18 || Number.isInteger(value) && value.toString().length > 15) {
          return formatUnits(BigInt(Math.floor(value)), decimals);
        }
        // Already formatted
        return value.toString();
      }

      // String
      if (typeof value === "string") {
        // Empty string
        if (value === "") return "0";

        // Hex string (0x...)
        if (value.startsWith("0x")) {
          return formatUnits(BigInt(value), decimals);
        }

        // Check if it's a numeric string
        const cleanValue = value.replace(/,/g, '');
        if (!isNaN(cleanValue) && cleanValue !== "") {
          // If it's a very large number (likely in wei)
          if (cleanValue.length > 18 && !cleanValue.includes('.')) {
            return formatUnits(BigInt(cleanValue), decimals);
          }
          // Already formatted
          return cleanValue;
        }

        // If it's a number with scientific notation
        if (value.includes('e')) {
          const num = Number(value);
          if (num > 1e18) {
            return formatUnits(BigInt(Math.floor(num)), decimals);
          }
          return num.toString();
        }

        // Not a valid number
        return "0";
      }

      // Any other type
      return "0";
    } catch (error) {
      console.warn("Error resolving value:", value, error);
      return "0";
    }
  },

  /**
   * Converts any value to a number (float)
   */
  toNumber: (value, decimals = 18) => {
    const result = resolveValue.toHumanReadable(value, decimals);
    return parseFloat(result);
  },

  /**
   * Converts any value to BigInt (in wei)
   */
  toWei: (value, decimals = 18) => {
    if (value === null || value === undefined || value === "") {
      return 0n;
    }

    try {
      if (typeof value === "bigint") {
        return value;
      }

      if (typeof value === "number") {
        // If it's already in wei (large number)
        if (value > 1e18) {
          return BigInt(Math.floor(value));
        }
        // Convert from human-readable to wei
        return parseUnits(value.toString(), decimals);
      }

      if (typeof value === "string") {
        const cleanValue = value.replace(/,/g, '');
        
        // If it's a hex string
        if (cleanValue.startsWith("0x")) {
          return BigInt(cleanValue);
        }

        // If it's already in wei (large number without decimals)
        if (/^\d+$/.test(cleanValue) && cleanValue.length > 18) {
          return BigInt(cleanValue);
        }

        // Convert from human-readable to wei
        return parseUnits(cleanValue, decimals);
      }

      return 0n;
    } catch (error) {
      console.warn("Error converting to wei:", value, error);
      return 0n;
    }
  }
};

// Simplified usage
export const resolveEther = (value) => {
  return resolveValue.toHumanReadable(value, 18);
};

export const resolveEtherNumber = (value) => {
  return resolveValue.toNumber(value, 18);
};

export const resolveEtherWei = (value) => {
  return resolveValue.toWei(value, 18);
};