// import { useEffect, useState, useRef } from "react";
// const Hook = () => {
//     const [name , setName] = useState('');
//     const countRef = useRef(0);
//     const inputRef = useRef();

//     useEffect(()=>{
//         countRef.current=countRef.current+1;
//     })

//     function focus(){
//         inputRef.current.focus();
//         inputRef.current.value = 'please focus';
//     }

//     return (
//         <div>
//             <input ref={inputRef} 
//             value={name} 
//             onChange={el=> setName(el.target.value)} />
//             <div>My name is {name}</div>
//             <div>I render {countRef.current} times</div>
//             <button onClick={focus}>click to focus</button>
//         </div>
//       );
// }
 
// export default Hook;