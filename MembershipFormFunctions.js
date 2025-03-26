'use strict';
/*AAW TSG 25/11/20 Membership Form Code - add filters for subgrids (not supported, customer aware) */
const PRODUCT_ATTRIBUTE = "tsg_productid";
const ORGANISATION_ATTRIBUTE = 'tsg_membercompanyid';
const CLASS_ATTRIBUTE ='tsg_membershipclass';
const GENERAL_TAB = 'tabGeneral';
const QV_SECTION = 'QVSection';

function formOnLoad (executionContext)
{
	/*AAW TSG 25/11/20 Load function*/

    var formContext = executionContext.getFormContext();
    membershipClassOnChange(executionContext);
    var productObject = formContext.getAttribute(PRODUCT_ATTRIBUTE).getValue();
    var orgObject = formContext.getAttribute(ORGANISATION_ATTRIBUTE).getValue();
    if (productObject && orgObject)
    {
        var productId = productObject[0].id;
        var orgId = orgObject[0].id;
        if (productId && orgId)
        {
            var fetchData = {
                statecode: "0",
                tsg_productid: productId,
                tsg_accountid: orgId
            };
            filterSubgridTeamCommentary(executionContext, fetchData);  //AAW 22/12 - Team Commentaries added
            filterSubgridTeams(executionContext, fetchData);
            filterSubGridReps(executionContext, fetchData);
            filterSubgridSubteams(executionContext, fetchData);
            filterSubGridSubteamReps(executionContext, fetchData);
            filterSubgridParticipation(executionContext, fetchData);
            filterSubgridEvents(executionContext, fetchData);
            filterSubgridAttendees(executionContext, fetchData);
            


            
        }
    }

}

function membershipClassOnChange(executionContext)
{
    var formContext = executionContext.getFormContext();
    var classAttribute = formContext.getAttribute(CLASS_ATTRIBUTE).getSelectedOption();
    if (classAttribute)
    {
        var tabObj = formContext.ui.tabs.get(GENERAL_TAB);
        if (classAttribute.value == 866120001)  //TBYB
        {
            if(tabObj){tabObj.sections.get(QV_SECTION).setVisible(true)};
        }
        else
        {
            if(tabObj){tabObj.sections.get(QV_SECTION).setVisible(false)};
        }
    }
}

function filterSubgridTeamCommentary(executionContext, fetchData)
{
    var formContext = executionContext.getFormContext();
    // build the filterXML (not the full fetch)
        var filterXml = [
            "    <filter type='and'>",
            "      <condition attribute='statecode' operator='eq' value='", fetchData.statecode/*0*/, "'/>",
            "      <condition attribute='tsg_organisationid' operator='eq' value='", fetchData.tsg_accountid/*account*/, "'/>",
            "    </filter>",
            "    <filter type='or'>",
            "      <condition entityname='TC_PrPh' attribute='tsg_productid' operator='eq' value='",fetchData.tsg_productid,"' uitype='product' />",
            "      <condition entityname='TC_PrT' attribute='tsg_productid' operator='eq' value='",fetchData.tsg_productid,"' uitype='product' />",
            "    </filter>",
            "    <link-entity name='tsg_productphorum' from='tsg_phorumid' to='tsg_phorumid' link-type='outer' alias='TC_PrPh' />",
            "    <link-entity name='tsg_productworkstream' from='tsg_workstreamid' to='tsg_teamid' link-type='outer' alias='TC_PrT' />",
            
        ].join("");
    var gridName = "SG_TeamCommentary";
    setSubgridFilterXml(executionContext, formContext, gridName, filterXml);
  
}

function filterSubgridTeams(executionContext, fetchData)
{
    var formContext = executionContext.getFormContext();

    // build the filterXML (not the full fetch)
    var filterXml = [
        "    <filter type='or'>",
        "      <condition entityname='t_PT' attribute='tsg_productid' operator='eq' value='",fetchData.tsg_productid,"' uitype='product' />",
        "      <condition entityname='Ph_Ph_Pt' attribute='tsg_productid' operator='eq' value='",fetchData.tsg_productid,"' uitype='product' />",
        "    </filter>",
        "    <filter type='and'>",
        "      <condition attribute='statecode' operator='eq' value='", fetchData.statecode/*0*/, "'/>",
        "    </filter>",
        "    <link-entity name='tsg_productworkstream' from='tsg_workstreamid' to='tsg_workstreamid' link-type='outer' alias='t_PT' />",
        "    <link-entity name='tsg_phorum' from='tsg_phorumid' to='tsg_phorumid' link-type='outer' alias='t_Ph'>",
        "      <link-entity name='tsg_productphorum' from='tsg_phorumid' to='tsg_phorumid' link-type='outer' alias='Ph_Ph_Pt' />",
        "    </link-entity>",
            ].join("");
    var gridName = "SG_Teams" ;
    setSubgridFilterXml(executionContext, formContext, gridName, filterXml)
  
}

function filterSubGridReps(executionContext, fetchData)
{
    var formContext = executionContext.getFormContext();

    // build the filterXML (not the full fetch)
        var filterXml = [
            "    <filter type='and'>",
            "      <condition attribute='statuscode' operator='in'>",
            "        <value>1</value>",
            "        <value>866120005</value>",
            "      </condition>",
            "      <condition attribute='tsg_accountid' operator='eq' value='", fetchData.tsg_accountid/*account*/, "'/>",
            "    </filter>",
            "    <filter type='or'>",
            "      <condition entityname='TR_PrT' attribute='tsg_productid' operator='eq' value='",fetchData.tsg_productid,"' uitype='product' />",
            "      <condition entityname='TR_PrPh' attribute='tsg_productid' operator='eq' value='",fetchData.tsg_productid,"' uitype='product' />",
            "    </filter>",
            "    <link-entity name='tsg_productworkstream' from='tsg_workstreamid' to='tsg_workstreamid' link-type='outer' alias='TR_PrT' />",
            "    <link-entity name='tsg_productphorum' from='tsg_phorumid' to='tsg_phorumid' link-type='outer' alias='TR_PrPh' />"
        ].join("");
    var gridName = "SG_TeamReps" ;
    setSubgridFilterXml(executionContext, formContext, gridName, filterXml)

}

function filterSubgridSubteams(executionContext, fetchData)
{
    var formContext = executionContext.getFormContext();

    // build the filterXML (not the full fetch)
    var filterXml = [
        "    <filter type='and'>",
        "      <condition attribute='statecode' operator='eq' value='", fetchData.statecode/*0*/, "'/>",
        "      <condition attribute='tsg_organisationid' operator='eq' value='", fetchData.tsg_accountid/*account*/, "'/>",
        "    </filter>",
        "    <filter type='or'>",
        "      <condition entityname='StC_PrT' attribute='tsg_productid' operator='eq' value='",fetchData.tsg_productid,"' uitype='product' />",
        "      <condition entityname='StC_PrPh' attribute='tsg_productid' operator='eq' value='",fetchData.tsg_productid,"' uitype='product' />",
        "    </filter>",
        "    <link-entity name='tsg_productworkstream' from='tsg_workstreamid' to='tsg_teamid' link-type='outer' alias='StC_PrT' />",
        "    <link-entity name='tsg_productphorum' from='tsg_phorumid' to='tsg_phorumid' link-type='outer' alias='StC_PrPh' />",
            ].join("");
    var gridName = "SG_Subteams" ;
    setSubgridFilterXml(executionContext, formContext, gridName, filterXml)
 
    
}

function filterSubGridSubteamReps(executionContext, fetchData)
{
    var formContext = executionContext.getFormContext();

    // build the filterXML (not the full fetch)
        var filterXml = [
            "    <filter type='or'>",
            "      <condition entityname='SR_PrT' attribute='tsg_productid' operator='eq' value='",fetchData.tsg_productid,"'  uitype='product' />",
            "      <condition entityname='SR_PrPh' attribute='tsg_productid' operator='eq' value='",fetchData.tsg_productid,"'  uitype='product' />",
            "    </filter>",
            "    <filter type='and'>",
            "      <condition attribute='statecode' operator='eq' value='", fetchData.statecode/*0*/, "'/>",
            "      <condition attribute='tsg_accountid' operator='eq' value='", fetchData.tsg_accountid/*account*/, "'/>",
            "    </filter>",
            "    <link-entity name='tsg_productworkstream' from='tsg_workstreamid' to='tsg_workstreamid' link-type='outer' alias='SR_PrT' />",
            "    <link-entity name='tsg_productphorum' from='tsg_phorumid' to='tsg_phorumid' link-type='outer' alias='SR_PrPh' />",
        ].join("");
    var gridName = "SG_SubteamReps" ;
    setSubgridFilterXml(executionContext, formContext, gridName, filterXml)

}

function filterSubgridEvents(executionContext, fetchData)
{
    var formContext = executionContext.getFormContext();

    // build the filterXML (not the full fetch)
	var filterXml = [
        "    <filter type='and'>",
        "      <condition attribute='statecode' operator='eq' value='", fetchData.statecode/*0*/, "'/>",
        "      <condition attribute='tsg_engagementtype' operator='eq' value='866120005'/>",
        "      <filter type='or'>",
        "        <condition attribute='tsg_startdate' operator='next-x-years' value='99'/>",
        "        <condition attribute='tsg_startdate' operator='last-x-years' value='1'/>",
        "      </filter>",
        "    </filter>",
        "    <filter type='or'>",
        "      <condition entityname='E_TPr' attribute='tsg_productid' operator='eq' value='",fetchData.tsg_productid,"' uitype='product' />",
        "      <condition entityname='ET_PrPH' attribute='tsg_productid' operator='eq' value='",fetchData.tsg_productid,"' uitype='product' />",
        "    </filter>",
        "    <link-entity name='tsg_productworkstream' from='tsg_workstreamid' to='tsg_workstreamid' link-type='outer' alias='E_TPr' />",
        "    <link-entity name='tsg_workstream' from='tsg_workstreamid' to='tsg_workstreamid' link-type='outer' alias='E_T'>",
        "      <link-entity name='tsg_productphorum' from='tsg_phorumid' to='tsg_phorumid' link-type='outer' alias='ET_PrPH' />",
        "    </link-entity>",
            ].join("");
    var gridName = "SG_Events" ;
    setSubgridFilterXml(executionContext, formContext, gridName, filterXml)
   
}


function filterSubgridAttendees(executionContext, fetchData)
{
    var formContext = executionContext.getFormContext();
    //Registrations for Sessions on Events where the Team is included with this Product
    // build the filterXML (not the full fetch)
        var filterXml = [
   "    <filter type='and'>",
    "      <condition entityname='A_S' attribute='tsg_engagementtype' operator='eq' value='866120005' />",
    "      <condition attribute='statecode' operator='eq' value='", fetchData.statecode/*0*/, "'/>",
    "      <condition attribute='tsg_accountid' operator='eq' value='", fetchData.tsg_accountid/*account*/, "'/>",
    "    </filter>",
    "    <filter type='or'>",
    "      <condition entityname='AS_PrT' attribute='tsg_productid' operator='eq' value='",fetchData.tsg_productid,"' uitype='product' />",
    "      <condition entityname='AS2T_PrPh' attribute='tsg_productid' operator='eq' value='",fetchData.tsg_productid,"' uitype='product' />",
    "    </filter>",
    "    <link-entity name='tsg_session' from='tsg_sessionid' to='tsg_sessionid' link-type='outer' alias='A_S'>",
    "      <link-entity name='tsg_productworkstream' from='tsg_workstreamid' to='tsg_teamid' link-type='outer' alias='AS_PrT' />",
    "    </link-entity>",
    "    <link-entity name='tsg_session' from='tsg_sessionid' to='tsg_sessionid' link-type='outer' alias='A_S2'>",
    "      <link-entity name='tsg_workstream' from='tsg_workstreamid' to='tsg_teamid' link-type='outer' alias='AS2_T'>",
    "        <link-entity name='tsg_productphorum' from='tsg_phorumid' to='tsg_phorumid' link-type='outer' alias='AS2T_PrPh' />",
    "      </link-entity>",
    "    </link-entity>",
        ].join("");
    var gridName = "SG_Attendees" ;
    setSubgridFilterXml(executionContext, formContext, gridName, filterXml)
   
}

function filterSubgridParticipation(executionContext, fetchData)
{
    // Participation for Sessions on Engagements for Teams within this Membership
    var formContext = executionContext.getFormContext();
    // build the filterXML (not the full fetch)
        var filterXml = [
   "    <filter type='and'>",
    "      <condition entityname='A_S' attribute='tsg_engagementtype' operator='neq' value='866120005' />",
    "      <condition attribute='statecode' operator='eq' value='", fetchData.statecode/*0*/, "'/>",
    "      <condition attribute='tsg_accountid' operator='eq' value='", fetchData.tsg_accountid/*account*/, "'/>",
    "    </filter>",
    "    <filter type='or'>",
    "      <condition entityname='AS_PrT' attribute='tsg_productid' operator='eq' value='",fetchData.tsg_productid,"' uitype='product' />",
    "      <condition entityname='AS2T_PrPh' attribute='tsg_productid' operator='eq' value='",fetchData.tsg_productid,"' uitype='product' />",
    "    </filter>",
    "    <link-entity name='tsg_session' from='tsg_sessionid' to='tsg_sessionid' link-type='outer' alias='A_S'>",
    "      <link-entity name='tsg_productworkstream' from='tsg_workstreamid' to='tsg_teamid' link-type='outer' alias='AS_PrT' />",
    "    </link-entity>",
    "    <link-entity name='tsg_session' from='tsg_sessionid' to='tsg_sessionid' link-type='outer' alias='A_S2'>",
    "      <link-entity name='tsg_workstream' from='tsg_workstreamid' to='tsg_teamid' link-type='outer' alias='AS2_T'>",
    "        <link-entity name='tsg_productphorum' from='tsg_phorumid' to='tsg_phorumid' link-type='outer' alias='AS2T_PrPh' />",
    "      </link-entity>",
    "    </link-entity>",
        ].join("");
    var gridName = "SG_Participation" ;
    setSubgridFilterXml(executionContext, formContext, gridName, filterXml);
  
}




