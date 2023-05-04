function search(key)
{
    const parameters=new Proxy(new URLSearchParams(window.location.search), 
    {
        get: (searchParameters, prop)=>searchParameters.get(prop),
    });
    let result=parameters.getAll(key);
    return result;
}
