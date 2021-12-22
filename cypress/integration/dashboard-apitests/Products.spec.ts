/// <reference types="cypress" />

import { parse } from "querystring";

describe('GET users', () => { 
    let expecteddamagedDefectivetotals = [39,12,1,1,2,1,1,11,2,134,56,2,0,5,5,0,25,47,0,0]
    let fulfilledqtyTotals = [834,670,89,89,140,113,143,1599,605,925,583,9,37,561,338,28,285,418,40,46]
    let unfulfillableTotalfromFulfilledQty = [40,12,1,1,2,1,1,14,2,135,56,2,0,5,5,0,25,47,0,0]
    it('Response code should be 200', () => {
      cy.request({
        method: 'GET',
        url: '/products'
      }).then((response) => {
        expect(response.status).to.equal(200);
      })
    })
    it('Validate Damaged Defective Totals of each product', () => {
        cy.request({
          method: 'GET',
          url: '/products'
        }).then((response) => {
            for(var index=0; index<=response.body.data.length-1; index++){
                let customer_damaged = response.body.data[index].customer_damaged
                let defective = response.body.data[index].defective
                let total = parseInt(customer_damaged) + parseInt(defective)
                expect(total).to.eq(expecteddamagedDefectivetotals[index])
            }
          
         })
        })
        it('Validate fulfilled qty totals of the product', () => {
            cy.request({
              method: 'GET',
              url: '/products'
            }).then((response) => {
                // available=fulfillable, transfer, inbound=inbound_shipped + inbound_working + inbound_working,total_unfulfillable, total_researching 
                for(var index=0; index<=response.body.data.length-1; index++){
                    cy.log("Comparing the total fulfillable quantity at",index )
                    let available = response.body.data[index].fulfillable
                    let transfer = response.body.data[index].transfer
                    let inbound = response.body.data[index].inbound_shipped + response.body.data[index].inbound_receiving + response.body.data[index].inbound_working
                    //cy.log("This is the inboud value at" + index+'------>' + inbound)
                    let unfulfillable = response.body.data[index].total_unfulfillable
                    let researching = response.body.data[index].total_researching 
                   let total = (parseInt(available) + parseInt(transfer) + parseInt(inbound) + parseInt(unfulfillable) + parseInt(researching))
                    expect(total).to.eq(fulfilledqtyTotals[index])
                }
              
             })

            })
            it('Validate unfulfilled qty from bothfulfilled and unfulfilled qty from fulfilled section with sum of damaged and defective', () => {
                cy.request({
                  method: 'GET',
                  url: '/products'
                }).then((response) => {
                    // available=fulfillable, transfer, inbound=inbound_shipped + inbound_working + inbound_working,total_unfulfillable, total_researching 
                    for(var index=0; index<=response.body.data.length-1; index++){
                        let unfulfillable = response.body.data[index].total_unfulfillable
                        let customer_damaged = response.body.data[index].customer_damaged
                        let defective = response.body.data[index].defective
                        let total = parseInt(customer_damaged) + parseInt(defective)
                        expect(total).to.eq(unfulfillableTotalfromFulfilledQty[index])
                    }
                  
                 })
                })
         })
