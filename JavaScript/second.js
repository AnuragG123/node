function add(a,b){
    return a+b
}

add(1,2)

//Es6
var add = (a,b) => { return a+b}

add(1,2)

////destructure
var a = 10

var studnet ={
    marks:a
}

studnet.marks    
10

var marks = 20

var studnet1 ={
    marks:marks
}

var studnet1 ={
    marks
}
studnet1.marks
20

//Contact//
var a = 10
var classname = "Node"
//es5
"my age is "+a+" and my class is "+classname+"."
//es6
`my age is ${a} and my class is ${classname}`