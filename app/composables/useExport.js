export const useExport = () => {
  // Export as Excel
  const exportToExcel = (data, filename = 'data') => {
    try {
      // Create CSV format first
      const csvContent = convertToCSV(data)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      downloadFile(blob, `${filename}.csv`)
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      throw new Error('Failed to export data as Excel')
    }
  }

  // Export as PDF
  const exportToPDF = (data, filename = 'data') => {
    try {
      // Create a simple PDF content
      const content = generatePDFContent(data)
      const blob = new Blob([content], { type: 'application/pdf' })
      downloadFile(blob, `${filename}.pdf`)
    } catch (error) {
      console.error('Error exporting to PDF:', error)
      throw new Error('Failed to export data as PDF')
    }
  }

  // Convert data to CSV format
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return ''
    
    const headers = Object.keys(data[0])
    const csvHeaders = headers.join(',')
    
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header]
        // Handle values that contain commas, quotes, or newlines
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value || ''
      }).join(',')
    })
    
    return [csvHeaders, ...csvRows].join('\n')
  }

  // Generate PDF content (simplified)
  const generatePDFContent = (data) => {
    let content = `Group Data Report\n\n`
    
    data.forEach((item, index) => {
      content += `Group ${index + 1}:\n`
      content += `- ID: ${item.id}\n`
      content += `- Global ID: ${item.global_id}\n`
      content += `- Name: ${item.group_name}\n`
      content += `- Status: ${item.active ? 'Active' : 'Inactive'}\n`
      content += `- Created: ${item.created_at}\n\n`
    })
    
    return content
  }

  // Download file helper
  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return {
    exportToExcel,
    exportToPDF,
    convertToCSV,
    downloadFile
  }
}