// Structs contain data, but can also have logic. In this exercise we have
// defined the Package struct and we want to test some logic attached to it.
// Make the code compile and the tests pass!

// I AM NOT DONE

struct Package {
    // ISO 3166-1 alpha-3 Country code
    sender_country: [u8; 3],
    // ISO 3166-1 alpha-3 Country code
    recipient_country: [u8; 3],
    weight_in_grams: u32,
}

trait PackageTrait {
    fn new(sender_country: [u8; 3], recipient_country: [u8; 3], weight_in_grams: u32) -> Self;
    fn is_international(self) -> //???;
    fn get_fees(self, cents_per_gram: u32) -> //???;
}

impl PackageTrait for Package {
    fn new(sender_country: [u8; 3], recipient_country: [u8; 3], weight_in_grams: u32) -> Self {
        assert(weight_in_grams != 0);
        Package { sender_country, recipient_country, weight_in_grams,  }
    }

    fn is_international(self) -> //???
    {
    /// Something goes here...
    }

    fn get_fees(self, cents_per_gram: u32) -> //???
    {
    /// Something goes here...
    }
}


#[test(should_fail)]
fn fail_creating_weightless_package() {
    let sender_country = "ESP".as_bytes();
    let recipient_country = "AUT".as_bytes();
    let _ = Package::new(sender_country, recipient_country, 0);
}

#[test]
fn create_international_package() {
    let sender_country = "ESP".as_bytes();
    let recipient_country = "RUS".as_bytes();

    let mut package = Package::new(sender_country, recipient_country, 1200);

    assert(package.is_international() == true);
}

#[test]
fn create_local_package() {
    let sender_country = "CAN".as_bytes();
    let recipient_country = sender_country;

    let mut package = Package::new(sender_country, recipient_country, 1200);

    assert(package.is_international() == false);
}

#[test]
fn calculate_transport_fees() {
    let sender_country = "ESP".as_bytes();
    let recipient_country = "ESP".as_bytes();

    let cents_per_gram = 3;

    let mut package = Package::new(sender_country, recipient_country, 1500);

    assert(package.get_fees(cents_per_gram) == 4500);
}

