/**
 * Format a date string to local Indonesian format (DD/MM/YYYY)
 * @param dateString - Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };
  
  /**
   * Format a time string to 24-hour format (HH:MM)
   * @param timeString - Time string in format HH:MM:SS
   * @returns Formatted time string
   */
  export const formatTime = (timeString: string): string => {
    try {
      // If timeString is already in HH:MM format, just return it
      if (/^\d{2}:\d{2}$/.test(timeString)) {
        return timeString;
      }
      
      // If timeString is in HH:MM:SS format, remove the seconds
      if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
        return timeString.substring(0, 5);
      }
      
      // If timeString is a full ISO date string, extract the time part
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      }
      
      return timeString || "N/A";
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeString || "N/A";
    }
  };
  
  /**
   * Format a datetime string to local Indonesian format (DD/MM/YYYY HH:MM)
   * @param dateTimeString - Datetime string to format
   * @returns Formatted datetime string
   */
  export const formatDateTime = (dateTimeString: string): string => {
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      return `${formatDate(dateTimeString)} ${formatTime(dateTimeString)}`;
    } catch (error) {
      console.error("Error formatting datetime:", error);
      return "Invalid datetime";
    }
  };