/**
 * @description returns the value of a query string sent in a URL.
 * @param a key of type string.
 * @returns a string containing the value 
 */
function search(key)
{
    const parameters=new URLSearchParams(window.location.search);
    return parameters.get(key);
}
export default search;