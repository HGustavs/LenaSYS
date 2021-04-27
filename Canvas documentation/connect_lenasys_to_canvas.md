# Learning Tools Interoperability (LTI) & URL API
It’s possible to connect to Canvas through LTI 1,1 & 1,3 and also URL API.

## LTI
Canvas have implemented LTI through the tool curl. Where each post (curl) should be returned with a json file which contains the data.

How to create an LTI development key for Canvas can be found in these links:

[How do config an external app for an account using a client ID](https://community.canvaslms.com/t5/Admin-Guide/How-do-I-configure-an-external-app-for-an-account-using-a-client/ta-p/202)

[How to config an LTI key for an account](https://community.canvaslms.com/t5/Admin-Guide/How-do-I-configure-an-LTI-key-for-an-account/ta-p/140)




Most of the commands for Canvas LTI should be located at the bottom of the canvas wiki created by instructure whom host Canvas for institutions.

[Configuring LTI advantage tools and overview of an LTI launch](https://canvas.instructure.com/doc/api/file.lti_dev_key_config.html)

Curl example:
<pre>
“curl 'https:///api/v1/users/self/files'
-F 'url=http://example.com/my_pic.jpg'
-F 'name=profile_pic.jpg'
-F 'size=302185'
-F 'content_type=image/jpeg'
-F 'parent_folder_path=my_files/section1'
-H "Authorization: Bearer "
”
</pre>
Return data (JSON):
<pre>
{
    "upload_url": "https://file-service.url/opaque",
    "upload_params": {
        /* unspecified parameters; contents should be treated as opaque */
    },
    "progress": {
        /* amongst other tags, see the Progress API... */
        "url": "https://canvas.example.edu/api/v1/progress/1"
        "workflow_state": "running"
    }
}

</pre>
How to make LTI GET commands could most likely be found at these sites:

[](http://www.imsglobal.org/spec/lti-ags/v2p0/)

## URL API
Another possible path is to create a connection through URL API which have some PHP (UDOIT) and Python (canvasapi) libraries currently available from University of Central Florida. The URL API request needs also to have a development key to work. And can be found at roughly the same place as the LTI development key. Just as LTI so does URL API return a JSON file.

[University of Central Florida, Github repositary](https://github.com/ucfopen/)

A site that have some examples of URL API implementation videos:

[Other projects that uses URL API](https://community.canvaslms.com/t5/Developers-Group/Canvas-APIs-Getting-started-the-practical-ins-and-outs-gotchas/ba-p/263685)
