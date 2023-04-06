//import axios from 'axios';
// import 'jquery';
// import $ from 'jquery';
const Comment = () => {
    //fetch method
    //It is internal library and I can use it without call it , but it is slow compared to other
    //it will give me get request by default
    //when you consloe log res before you do res.json you can not see the data only meta data is 
    //avilable
    // fetch('https://jsonplaceholder.typicode.com/users')
    //     .then(res => {
    //         return res.json();
    //     })
    //     .then(data => {
    //         console.log(data);
    //     })
    //     .catch (err =>{
    //         console.log(err);
    //     })

    // axios.get('https://jsonplaceholder.typicode.com/users')
    //         .then(res=>{
    //             console.log(res.data);
    // //here with axios you can see the data before you turn it to res.json 
    // //so we do not need to convert to res.json()
    //         })
    //         .catch (err => {
    //             console.log(err.message);
    //         })


    // const xhr = new XMLHttpRequest();
    // xhr.open('GET','https://jsonplaceholder.typicode.com/users');
    // xhr.responseType = 'json';
    // xhr.send();
    // xhr.onload = () => {
    //     console.log(xhr.response);
    // };


    // jquery.get('https://jsonplaceholder.typicode.com/users',data => {
    //     console.log(data);
    // });
    //it will be used in case of sending analytical data
    // navigator.sendBeacon('https://jsonplaceholder.typicode.com/users', JSON.stringify({
    //     timeOnPage:25
    // }));




    return ( <div>
        <h1>Comment website</h1>
    </div> );
}
 
export default Comment;
