export const useImport = () => {
  // Import from CSV file
  const importFromCSV = () => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.csv,.xlsx,.xls'
      
      input.onchange = (event) => {
        const file = event.target.files[0]
        if (!file) {
          reject(new Error('No file selected'))
          return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const csvContent = e.target.result
            const parsedData = parseCSV(csvContent)
            resolve(parsedData)
          } catch (error) {
            reject(new Error('Failed to parse CSV file'))
          }
        }
        
        reader.onerror = () => {
          reject(new Error('Failed to read file'))
        }
        
        reader.readAsText(file)
      }
      
      input.click()
    })
  }

  // Parse CSV content
  const parseCSV = (csvContent) => {
    const lines = csvContent.split('\n').filter(line => line.trim())
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header and one data row')
    }
    
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''))
    const data = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      if (values.length === headers.length) {
        const row = {}
        headers.forEach((header, index) => {
          row[header] = values[index]
        })
        data.push(row)
      }
    }
    
    return data
  }

  // Parse a single CSV line (handles quotes and commas)
  const parseCSVLine = (line) => {
    const result = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++ // Skip next quote
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current.trim())
    return result
  }

  // Validate imported group data
  const validateGroupData = (data) => {
    const requiredFields = ['global_id', 'group_name']
    const errors = []
    
    data.forEach((row, index) => {
      requiredFields.forEach(field => {
        if (!row[field] || row[field].trim() === '') {
          errors.push(`Row ${index + 1}: ${field} is required`)
        }
      })
    })
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  return {
    importFromCSV,
    parseCSV,
    validateGroupData
  }
}