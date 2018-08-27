# drapid
NoSQL/hash table for Node.js under 4KB and no external dependencies 

Use cases:
* On small and medium Node.js projects where any **data has to be stored in a structured way**. (Browserify may even extend the support to browsers, but that was not tested yet!)
* **High performance** is needed **for both data insertion and lookup**, so the use of hash tables.
* The module is **tiny and free of useless bloat** allowing the usage **on space constraint environments**.
* **Broader compatibility** with the module supporting any array of objects (formatted using JSON) as a valid database.

### Installation:
```
$ npm install @phtdacosta/drapid --save
```
## Basic usage:

```js
// Requires the Drapid module
const Drapid = require('drapid')
// Instantiates the Standard database class
const db = Drapid.Standard('database.json', 'name')

// Includes two objects into the database
db.include({'name':'Rita', 'job':'mage'})
.then(db.include({'name':'Phil', 'job':'mage'}))

// Recovers any object (or objects) from the database
const mages = db.recover('job', 'mage')
// [{'name':'Rita', 'job':'mage'},{'name':'Phil', 'job':'mage'}]

```

# Documentation
## NoSQL Standard API
* Easy to use and ideal for most cases.
* Automatically loads the database from disk to memory at startup when supplied with a valid path.
## `Drapid.Standard({path: absolutePath, key: primaryKey})`
> Returns an `Object` instance of the standard class.

**Optional:** **`path`** is the absolute path including the file name which the database can persist in disk.

**Optional:** **`key`** is the main key used to identify every object in database. It is used only when the `combine` method is called.

## `include(object)`
> Returns a **`Promise`** along the index value of the object included.

**`object`** is any set of keys and their corresponding values.

## `recover(key, value)`
> Returns an **`Array`** containing **all objects matching the given key and the given value** even if no object was matched.

**`key`** is the object property to look for on each stored object.

**`value`** is the required value of the object property.

## `combine(value, object)`
> Returns an **`Array`** containing the index values of the combined objects.

**`value`** is the data associated with the main **`key`** attribute shared by all database objects.

**`object`** is a key-value pair to be combined with the existing database object.

1. This method **requires** that a main **`key`** has been previously set and that the object to be combined contains it.
2. This method **only adds new attributes or modifies existent ones**.

## `exclude(key, value)`
> Returns an **`Array`** containing all objects matching the given key and the given value that were removed or an empty one otherwise.

**`key`** is the object property to look for on each stored object.

**`value`** is the required value of the object property.

## `persistSync()`
> Returns **`void`** after synchronously dumping the database from memory into the path previously set or an **`Error`** if no path was previously specified.

## NoSQL Hash table API
* Extreme performance but high memory use.
## `Drapid.Hashtable({path: absolutePath, key: primaryKey, size: maxSize})`
> Returns an `Object` instance of the hash table class.

**Optional:** **`path`** is the absolute path including the file name which the database can persist in disk.

**`key`** is the main key used to identify every object in database. **It is required** for the hash table to work.

**Optional:** **`size`** sets the maximum quantity of objects the database can store. Default value is **131072**.

## `include(object)`
> Returns a **`Promise`** along the index value of the object included or an **`Error`** in case the position to be used is already occupied.

**`object`** is any set of keys and their corresponding values.

## `recover(value)`
> Returns an **`Object`** which value of the primary key is the same as the parameter given or **`null`** otherwise.

**`value`** is the data associated with the main **`key`** attribute shared by all database objects.

## `combine(value, object)`
> Returns a **`number`** representing the index values of the combined objects.

**`value`** is the data associated with the main **`key`** attribute shared by all database objects.

## `exclude(value)`
> Returns a **`number`** which value of the primary key is the same as the parameter given or **`null`** otherwise.

**`value`** is the data associated with the main **`key`** attribute shared by all database objects.

## `persistSync()`
> Returns **`void`** after synchronously dumping the database from memory into previously set path or an **`Error`** if none was previously specified.

## `persistAsync()`
> Returns an **`Promise`** dumping the database from memory into previously set path or an **`Error`** if none was previously specified.

# License
This project exists under the [MIT license](https://github.com/phtdacosta/drapid/blob/master/LICENSE).