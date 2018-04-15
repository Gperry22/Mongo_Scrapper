const dogArray = [{ name: 'tony', age: 34 }, { name: 'fluffy', age: 34 }, { name: 'Hamish', age: 34}];

const catArr = [{ name: 'jessie', age: 34 }, { name: 'cat', age: 34 }, { name: 'fluffy', age: 34}];

// const catName = 'fluffy';

const newDogArray = dogArray.filter((dog, index) => {
    const foundCat = catArr.find((cat, index) => {
        return dog.name === cat.name;
    })
    return foundCat === undefined; 
})

console.log(newDogArray);