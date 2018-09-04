const fs = require('fs'),
    crypto = require('crypto')

function isNullOrUndefined (value) {
    return (value === null || value === undefined)
}

// Callback checker for future asynchronous retrocompatibility
// function isCallback (callback) {
//     return (typeof callback === 'function')
// }

// Asynchronous loop for future asynchronous implementations
// async function asyncForEach (array, callback) {
//     for (let index = 0; index < array.length; index++) {
//       await callback(array[index], index, array)
//     }
// }

class Standard {
    constructor (params) {
        this.path = params.path
        this.key = params.key
        this.data = []
        // Using asynchronous instead of synchronous inside constructor method can cause data racing!
        if (isNullOrUndefined(this.path === false))
            this.loadSync()
   }

    loadSync () {
        try {
            fs.accessSync(this.path)
            console.log('[!]')
        } catch (error) {
            if (error && error.code === 'ENOENT') {
                console.log('[~]')
                // console.log(error)
            }
        }
        try {
            let buffer = fs.readFileSync(this.path, 'utf8')
            this.data = JSON.parse(buffer)
            console.log(this.data)
        } catch (error) {
            // console.log(error)
        }
    }

    persistAsync () {
        return new Promise((resolve, reject) => {
            if (isNullOrUndefined(this.path)) {
                const error = new Error('Not possible to persist without a path')
                reject(error)
            } else {
                fs.writeFile(this.path, JSON.stringify(this.data), (error) => {
                    if (error)
                        reject(error)
                    else
                        resolve(true)
                })
            }
        })
    }

    persistSync () {
        if (isNullOrUndefined(this.path)) {
            const error = new Error('Not possible to persist without a path')
            return error
        } else {
            try {
                fs.writeFileSync(this.path, JSON.stringify(this.data), 'utf8')
            } catch (error) {
                return error
            }
            return true
        }
    }

    include (object) {
        return new Promise((resolve, reject) => {
            resolve(this.data.push(object))
        })
    }

    find (key, value) {
        const array = new Array()
        let index = -1
        // Sequential algorithm
        for (const object of this.data) {
            index = index + 1
            for (const property of Object.keys(object)) {
                if (property === key && object[key] === value)
                    array.push(index)
            }
        }
        return array
    }

    recover (key, value) {
        const array = this.find(key, value)
        let index = -1
        for (const element of array) {
            index = index + 1
            array[index] = this.data[element]
        }
        return array
    }

    recoverAll () {
        return this.data
    }

    combine (value, object) {
        if (isNullOrUndefined(this.key)) {
            const error = new Error('Not possible to combine without a primary key')
            return error
        } else {
            const array = this.find(this.key, value)
            for (const index of array)
                Object.assign(this.data[index], object)
                // this.data[index] = object
            return array
        }
    }

    exclude (key, value) {
        const array = this.find(key, value)
        for (const index of array)
            this.data.splice(index, 1)
        return array
    }
}

class HashTable {
    constructor (params) {
        this.path = params.path
        if (isNullOrUndefined(params.key))
            throw Error('Hash table instance requires a primary key')
        else
            this.key = params.key
        if (isNullOrUndefined(params.size))
            this.data = new Array(131072).fill(null)
        else
            this.data = new Array(params.size).fill(null)
    }

    include (object) {
        return new Promise((resolve, reject) => {
            const index = this.generateIndex(object[this.key])
            if (isNullOrUndefined(this.data[index])) {
                this.data[index] = object
                resolve(index)
            } else {
                const error = new Error('Position already occupied by other object')
                reject(error)
            }

        })
    }

    persistAsync () {
        return new Promise((resolve, reject) => {
            if (isNullOrUndefined(this.path)) {
                const error = new Error('Not possible to persist without a path')
                reject(error)
            } else {
                fs.writeFile(this.path, JSON.stringify(this.data), (error) => {
                    if (error) {
                        reject(error)
                    } else {
                        console.log('[+]')
                        resolve(true)
                    }
                })    
            }
        })
    }

    find (value) {
        return this.generateIndex(value)
    }

    recover (value) {
        return this.data[this.find(value)]
    }

    combine (value, object) {
        const position = this.find(value)
        Object.assign(this.data[position], object)
        return position
    }

    exclude (value) {
        const position = this.find(value)
        this.data[position] = null
        return position
    }

    generateHash (value) {
        return crypto.createHash('md4').update(value).digest('hex')
    }

    generateIndex (value) {
        return parseInt(this.generateHash(value)) % this.data.length
    }
}

module.exports = {
    Standard : Standard,
    HashTable : HashTable
}