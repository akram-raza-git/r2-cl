interface FormData {
  name: string;
  email: string;
  gender: string;
  age: string;
  subscription: boolean;
  country: string;
  feedback: string;
}

export const predefinedData: FormData[] = [
  {
    name: "Zeeshan Ayoub",
    email: "zeeshan@example.com",
    gender: "male",
    age: "24",
    subscription: true,
    country: "India",
    feedback: "Great ML developer",
  },
  {
    name: "Akram Raza",
    email: "akram@example.com",
    gender: "male",
    age: "27",
    subscription: true,
    country: "USA",
    feedback: "Great service!",
  },
  {
    name: "Jane Smith",
    email: "janesmith@example.com",
    gender: "female",
    age: "25",
    subscription: false,
    country: "Canada",
    feedback: "Could improve on customer support.",
  },
  {
    name: "test Lee",
    email: "lee@example.com",
    gender: "male",
    age: "40",
    subscription: true,
    country: "Australia",
    feedback: "Loved the experience!",
  },
];

export const countries = ["India", "USA", "Japan", "Canada", "Australia"];
export const genders = ["Male", "Female", "Trans", "Other"];
export const formInitialFields = {
  name: "",
  email: "",
  gender: "",
  age: "",
  subscription: false,
  country: "",
  feedback: "",
};

export const errroFields = {
  name: false,
  email: false,
  gender: false,
  country: false,
};
