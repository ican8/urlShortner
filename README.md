# URL Shortner

This is a simple URL shortner written in javascript. 

# Working
On providing long url, a unique 7 character id is generated using [nanoid](https://www.npmjs.com/package/nanoid) which will be the pathname for shorten url. Complete shorten url will contain the hostname also. Original url, shortened url and no. of times shortened url is clicked is stored in the mongodb database.
<br />
Shorten url will look like
```
<hostname>/<nanoid>
```
Hence the shorten url will take nanoid lenth  + number of bytes require to represent hostname.
<br />
For example abc.pq host with nano id length 7 will need only 13 bytes for shorten url and make it easier to store and share the url!


# Configuration
Following variables needs to be set in .env file
| Parameter | Value   |
| :---:   | :-:       |
| mongodb connection   | MONGO_URI      |
| length of id (pathname)   | SHORTEN_LENGTH      

Refer [Nano Id Collision Calculator](https://zelark.github.io/nano-id-cc/) for crafting id length as per your requirement.
