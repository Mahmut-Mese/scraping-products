describe('Product options scraping', () => {
    it('Should scrape and return JSON array of all product options in the table', () => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
          })
      cy.visit('https://wltest.dns-systems.net/')
      
      // Wait for page to fully load before performing any actions
      cy.get('.sections_wrapper').should('be.visible')
  
      const scrapedData = []
  
      cy.get('.sections_wrapper .pricing-table .row-subscriptions  > div').each(($row) => {
        const header = $row.find('.package .header h3 ').text().trim()
        const description = $row.find('.package-features ul li:nth-child(1)').text().trim()
        const price = $row.find('.package-features ul li:nth-child(3) .package-price span').text().trim()
        const discount = $row.find('.package-features ul li:nth-child(3) .package-price p').text().trim()  
      
  
        scrapedData.push({
            header,
          description,
          price,
          discount
        }) 
      }).then(() => {
        // Sort the array in descending order based on annual price
  
        // Assert that the array is not empty
        expect(scrapedData.length).to.be.greaterThan(0)
  
        // Log the scraped data for debugging purposes
        console.log('Scraped Data:', scrapedData)
      })
      cy.fixture('product.json').then((fixtureData) => {
        scrapedData.forEach((scrapedDataItem, index) => {
            expect(scrapedDataItem).to.include.all.keys(Object.keys(fixtureData));
    });
     });
    })
  })
  