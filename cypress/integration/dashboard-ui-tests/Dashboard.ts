/// <reference types="cypress" />


import { it } from "mocha";

describe("dashboard Navigation",()=>{
    var FBAMenuData = new Array();
    var eachlineItemArray = new Array();
    var DamagedDefectiveItemsArray = new Array();
    before(function() {
        cy.visit('https://sellerfusion-qa-test.vercel.app/');
        cy.wait(3000)
         cy.get('span.MuiChip-label.MuiChip-labelSmall.css-1pjtbja').each(($el, index, $list) => {
              //cy.wrap($el).should('be.visible')
              cy.wrap($el).trigger('mouseover')
                cy.get('div.MuiTooltip-popper.MuiTooltip-popperInteractive.MuiTooltip-popperArrow').then(($ele) => {
                    const txt = $ele.text()
                    var txt1 = txt.replace(/,/g,'')
                    FBAMenuData.push(txt1)
                cy.wrap($el).trigger('focusout')
              })
            })
            
        cy.writeFile('/Users/sp/Desktop/PersonalProjects/CypressAssignments/cypress/fixtures/FBAPopupData.json',FBAMenuData)
        cy.readFile('/Users/sp/Desktop/PersonalProjects/CypressAssignments/cypress/fixtures/FBAPopupData.json').then((data) => {
            for(var each of data){
                
                eachlineItemArray.push(each.split(/([0-9]+)/))

            }
            for(var each of eachlineItemArray){
                DamagedDefectiveItemsArray.push(each.splice(12))
        
        }
        cy.writeFile('/Users/sp/Desktop/PersonalProjects/CypressAssignments/cypress/fixtures/LinteItems.json',eachlineItemArray)
        cy.writeFile('/Users/sp/Desktop/PersonalProjects/CypressAssignments/cypress/fixtures/damagedDefectiveItems.json',DamagedDefectiveItemsArray)
        
    })
})
        
// This test case validates the total of the quantities displayed in the first section of the Mouse hover menu of the FBA label

    it("TC01_Validating Total fulfilled quantity of First section in the FBA mouse hover menu",()=>{

        cy.readFile('/Users/sp/Desktop/PersonalProjects/CypressAssignments/cypress/fixtures/LinteItems.json').then((data)=>{
            let formattedArr = [];
            let FBAUnavailableFulFilledObj = (Available:number, Transfer:number, Inbound:number,Unfulfillable:number,Researching:number,Total:number) => {
                return {
                  Available: Available,
                  Transfer: Transfer,
                  Inbound: Inbound, 
                  Unfulfillable:Unfulfillable,
                  Researching:Researching,
                  Total:Total
                }
                
            };
            for(var item in data){
                formattedArr.push(FBAUnavailableFulFilledObj(parseInt(data[item][1]), parseInt(data[item][3]), parseInt(data[item][5]),parseInt(data[item][7]),parseInt(data[item][9]),parseInt(data[item][11])));
            }
            for(var each of formattedArr){
                    var totals = each.Available + each.Transfer + each.Inbound + each.Unfulfillable + each.Researching
                    expect(totals).to.equal(each.Total)
              
        
            }
        })
 
})


// This test case validates the total of both defective and damaged items 

it("TC02_Validating Total unfulfilled quantity of second section in the FBA mouse hover menu",()=>{

    cy.readFile('/Users/sp/Desktop/PersonalProjects/CypressAssignments/cypress/fixtures/damagedDefectiveItems.json').then((data)=>{
        for(var item of data){
            item.pop()
        }
        let formattedArr = [];
        let DamagedDefectiveItemsObj = (damaged:number, defective:number, total:number) => {
            return {
                damaged: damaged,
                defective: defective,
                total: total
            }
            
        };
       
           for(var eachitem in data){ 
            formattedArr.push(DamagedDefectiveItemsObj(parseInt(data[eachitem][1]), parseInt(data[eachitem][3]), parseInt(data[eachitem][5])));
           }
        for(var each of formattedArr){
                 var totals = each.damaged + each.defective
                expect(totals).to.equal(each.total)
          
    
        }
    })

})

})