function search(key)
{
    const parameters=new URLSearchParams(window.location.search);
    return parameters.get(key);
}
export default search;