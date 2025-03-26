/**
 * http://dotnetdust.blogspot.com/2020/06/setting-sub-grid-filterxml-in-unified.html?m=1
 * * Updates the Fetch XML of the Metadata which is used to generate the OData Query.
 * Since the metadata is shared at the page level, each grid will require a unique view to keep from interfering with other grids.
 * @param context Global Context
 * @param formContext Form Context
 * @param gridName Name of the Grid
 * @param filterXml Fetch Xml to set the Grid to
 */

 function setSubgridFilterXml(context, formContext, gridName, filterXml)
 {
    console.info("Unsupported.setSubgridFilterXml(): Executing for grid: ", gridName, ", fetchXml: ", filterXml);
    const gridControl = formContext.getControl(gridName);
    if (!gridControl) {
        console.warn(`No subgrid control found found name ${gridName} in Unsupported.setSubgridFilterXml()`);
        return;
    }
    try {
        const viewId = gridControl.getViewSelector().getCurrentView().id
            .toLowerCase()
            .replace("{", "")
            .replace("}", "");
        const view = getState(context).metadata.views[viewId];
        if (!view) {
            console.warn(`No view was found in the metadata for grid ${gridName} and viewId ${viewId}.`);
            return;
        }
        const originalXml = view.fetchXML;
        const fetchXml = removeFilters(removeLinkedEntities(originalXml));
        const insertAtIndex = fetchXml.lastIndexOf("</entity>");
        // Remove any white spaces between XML tags to ensure that different filters are compared the same when checking to refresh
        view.fetchXML = (fetchXml.substring(0, insertAtIndex) + filterXml + fetchXml.substring(insertAtIndex)).replace(/>\s+</g, "><");

        if (view.fetchXML !== originalXml) {
            // Refresh to load the new Fetch            
            gridControl.refresh();
        }

    } catch (err) {
        CommonLib.error(err);
        alert(`Error attempting unsupported method call setSubGridFetchXml for grid ${gridName}`);
    }
}

function getState(context) 
{
    return (context)._clientApiExecutor._store.getState();
}

function removeFilters(fetchXml)
{
    return removeXmlNode(fetchXml, "filter");
}

function removeLinkedEntities(fetchXml) 
{
    return removeXmlNode(fetchXml, "link-entity");
}

function removeXmlNode(xml, nodeName) 
{
    // Remove Empty tags i.e. <example /> or <example a="b" />
    xml = xml.replace(new RegExp(`<[\s]*${nodeName}[^/>]*\\/>`, "gm"), "");

    const startTag = "<" + nodeName;
    const endTag = `</${nodeName}>`;
    let endIndex = xml.indexOf(endTag);

    // use first end Tag to do inner search
    while (endIndex >= 0) {
        endIndex += endTag.length;
        const startIndex = xml.substring(0, endIndex).lastIndexOf(startTag);
        xml = xml.substring(0, startIndex) + xml.substring(endIndex, xml.length);
        endIndex = xml.indexOf(endTag);
    }
    return xml;
}

