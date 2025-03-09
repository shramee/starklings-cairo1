// Structs contain data, but can also have logic. In this exercise we have
// defined the Package struct and we want to test some logic attached to it.
// Make the code compile and the tests pass!

// I AM NOT DONE

#[derive(Copy, Drop)]
struct Package {
    sender_country: felt252,
    recipient_country: felt252,
    weight_in_grams: usize,
}

trait PackageTrait {
    fn new(sender_country: felt252, recipient_country: felt252, weight_in_grams: usize) -> Package;
    fn is_international(ref self: Package) -> //???;
    fn get_fees(ref self: Package, cents_per_gram: usize) -> //???;
}
impl PackageImpl of PackageTrait {
    fn new(sender_country: felt252, recipient_country: felt252, weight_in_grams: usize) -> Package {
        if weight_in_grams <= 0{
            let mut data = ArrayTrait::new();
            data.append('x');
            panic(data);
        }
        Package { sender_country, recipient_country, weight_in_grams,  }
    }

    fn is_international(ref self: Package) -> //???
    {
    /// Something goes here...
    }

    fn get_fees(ref self: Package, cents_per_gram: usize) -> //???
    {
    /// Something goes here...
    }
}

#[test]
#[should_panic]
fn fail_creating_weightless_package() {
    let sender_country = 'Spain';
    let recipient_country = 'Austria';
    PackageTrait::new(sender_country, recipient_country, 0);
}

#[test]
fn create_international_package() {
    let sender_country = 'Spain';
    let recipient_country = 'Russia';

    let mut package = PackageTrait::new(sender_country, recipient_country, 1200);

    assert(package.is_international() == true, 'Not international');
}

#[test]
fn create_local_package() {
    let sender_country = 'Canada';
    let recipient_country = sender_country;

    let mut package = PackageTrait::new(sender_country, recipient_country, 1200);

    assert(package.is_international() == false, 'International');
}

#[test]
fn calculate_transport_fees() {
    let sender_country = 'Spain';
    let recipient_country = 'Spain';

    let cents_per_gram = 3;

    let mut package = PackageTrait::new(sender_country, recipient_country, 1500);

    assert(package.get_fees(cents_per_gram) == 4500, 'Wrong fees');
}

