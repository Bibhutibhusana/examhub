const o={update(){return new Promise((a,r)=>{window.$.ajax({url:"/login/pre",method:"post",data:{a:1},success:([e])=>{window.$.ajaxSetup({headers:{"X-CSRF-TOKEN":e}}),a()},error:e=>{r(e)}})})}};export{o as C};
//# sourceMappingURL=chunk.D7u4Z2KhBOI5.js.map
