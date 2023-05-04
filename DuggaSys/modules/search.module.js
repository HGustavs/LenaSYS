function search()
{
    const parameters=new Proxy(new URLSearchParams(window.location.search), 
    {
        get: (searchParameters, prop)=>searchParameters.get(prop),
    });
    let result=parameters.get;
    return result;
}
export default search;