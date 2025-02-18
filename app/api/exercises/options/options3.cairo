#[derive(Drop)]
struct Student {
    name: felt252,
    courses: Array<Option<felt252>>,
}


fn display_grades(student: @Student, index: usize) {

    if index == 0 {
        println!("{} index 0", *student.name);
    }
    
    if index >= student.courses.len() {
        return ();
    }

    let course = *student.courses.at(index);

    // TODO: Modify the following lines so that if there is a grade for the course, it is printed.
    //       Otherwise, print "No grade".
    // 
    println!("grade is {}", course.unwrap());
    display_grades(student, index + 1);
}


#[test]
#[available_gas(20000000)]
fn test_all_defined() {
    let courses = array![
        Option::Some('A'),
        Option::Some('B'),
        Option::Some('C'),
        Option::Some('A'),
    ];
    let mut student = Student { name: 'Alice', courses: courses };
    display_grades(@student, 0);
}


#[test]
#[available_gas(20000000)]
fn test_some_empty() {
    let courses = array![
        Option::Some('A'),
        Option::None,
        Option::Some('B'),
        Option::Some('C'),
        Option::None,
    ];
    let mut student = Student { name: 'Bob', courses: courses };
    display_grades(@student, 0);
}
