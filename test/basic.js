'use strict'
// Requires the module locally from the parent folder
const Drapid = require('../src/index.js')

// Initializes a configuration object
// Makes the code more readable and easily modifiable
const config = {
    'key':'name' // Sets the database primary key
}

// Instantiates a standard class object
const std = new Drapid.Standard(config)
// Tests most important methods of the standard class
// Includes two objects into the collection
Promise.all([
    std.include({'name':'Rita', 'job':'mage'}),
    std.include({'name':'Phil', 'job':'mage'})
])
// Combines a new object into the existing one
.then(res => std.combine('Rita', {'race':'human'}))
// Recovers an entire object from the collection
.then(res => std.recover('race', 'human'))
// Excludes an object from the collection
.then(res => std.exclude('race', 'human'))
.catch(err => console.log(err))

// Instantiates a hash table class object
const ht = new Drapid.HashTable(config)
// Tests most important methods of the hash table class
// Includes two objects into the collection
Promise.all([
    std.include({'name':'Rita', 'job':'mage'}),
    std.include({'name':'Phil', 'job':'mage'})
])
// Combines a new object into the existing one
.then(res => ht.combine('Rita', {'race':'human'}))
// Recovers an entire object from the collection
.then(res => ht.recover('Rita'))
// Excludes an object from the collection
.then(res => ht.exclude('Rita'))
.catch(err => console.log(err))