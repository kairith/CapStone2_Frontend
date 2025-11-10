export const useFormat = () => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Invalid Time'
    }
  }

  const formatCurrency = (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return 'N/A'
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatNumber = (number, decimals = 0) => {
    if (number === null || number === undefined) return 'N/A'
    
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number)
  }

  const formatStatus = (status) => {
    return status ? 'Active' : 'Inactive'
  }

  const truncateText = (text, maxLength = 50) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return {
    formatDate,
    formatDateTime,
    formatTime,
    formatCurrency,
    formatNumber,
    formatStatus,
    truncateText
  }
}