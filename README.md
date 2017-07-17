## EntropyString for JavaScript

[![npm version](https://badge.fury.io/js/entropy-string.svg)](https://www.npmjs.com/package/entropy-string) &nbsp; [![Build Status](https://travis-ci.org/EntropyString/JavaScript.svg?branch=master)](https://travis-ci.org/EntropyString/JavaScript) &nbsp; [![License: ISC](https://cdn.rawgit.com/EntropyString/JavaScript/8bcbc005/ISC.svg)](https://en.wikipedia.org/wiki/ISC_license)

Efficiently generate cryptographically strong random strings of specified entropy from various character sets.

## <a name="TOC"></a>
 - [Installation](#Installation)
 - [TL;DR](#TLDR)
 - [Overview](#Overview)
 - [Real Need](#RealNeed)
 - [More Examples](#MoreExamples)
 - [Character Sets](#CharacterSets)
 - [Custom Characters](#CustomCharacters)
 - [Unique Characters](#UniqueCharacters)
 - [Efficiency](#Efficiency)
 - [Secure Bytes](#SecureBytes)
 - [Custom Bytes](#CustomBytes)

## <a name="Installation"></a>Installation

#### Yarn

```bash
  yarn add entropy-string
```

#### NPM

```bash
  npm install entropy-string
```

[TOC](#TOC)

## <a name="TLDR"></a>TL;DR

48-bit string using base32 characters:

  ```js
  const entropy = require('entropy-string')

  let bits = 48
  let string = entropy.randomString(bits, entropy.charSet32)
  ```

  > MRd272t4G3

48-bit string using hex characters:

  ```js
  string = entropy.randomString(bits, entropy.charSet16)
  ```

  > 7973b7cf643c

48-bit string using uppercase hex characters:

  ```js
  entropy.charSet16.use('0123456789ABCDEF')
  string = entropy.randomString(bits, entropy.charSet16)
  ```

  > 6D98AA8E6A46

Base 32 character string with a 1 in a million chance of a repeat in 30 such strings:

  ```js
  bits = entropy.bits(30, 1000000)
  string = entropy.randomString(bits, entropy.charSet32)
  ```

  > BqMhJM
  
Base 32 character string with a 1 in a trillion chance of a repeat in 10 million such strings:

  ```js
  bits = entropy.bitsWithPowers(7, 12)
  string = entropy.randomString(bits, entropy.charSet32)
  ```

  > H9fT8qmMBd9qLfqmpm

OWASP session ID using file system and URL safe characters:

  ```js
  bits = 128
  string = entropy.randomString(bits, entropy.charSet64)
  ```

  > RX3FzLm2YZmeBT2Y5n_79C

[TOC](#TOC)

## <a name="Overview"></a>Overview

`entropy-string` provides easy creation of randomly generated strings of specific entropy using various character sets. Such strings are needed when generating, for example, random IDs and you don't want the overkill of a GUID, or for ensuring that some number of items have unique names.

A key concern when generating such strings is that they be unique. To truly guarantee uniqueness requires that each newly created string be compared against all existing strings. The overhead of storing and comparing strings in this manner is often too onerous and a different tack is needed.

A common strategy is to replace the *guarantee of uniqueness* with a weaker but hopefully sufficient *probabilistic uniqueness*. Specifically, rather than being absolutely sure of uniqueness, we settle for a statement such as *"there is less than a 1 in a billion chance that two of my strings are the same"*. This strategy requires much less overhead, but does require we have some manner of qualifying what we mean by, for example, *"there is less than a 1 in a billion chance that 1 million strings of this form will have a repeat"*.

Understanding probabilistic uniqueness requires some understanding of [*entropy*](https://en.wikipedia.org/wiki/Entropy_(information_theory)) and of estimating the probability of a [*collision*](https://en.wikipedia.org/wiki/Birthday_problem#Cast_as_a_collision_problem) (i.e., the probability that two strings in a set of randomly generated strings might be the same).  Happily, you can use `entropy-string` without a deep understanding of these topics.

We'll begin investigating `entropy-string` by considering our [Real Need](Read%20Need) when generating random strings.

[TOC](#TOC)

## <a name="RealNeed"></a>Real Need

Let's start by reflecting on a common statement of need for developers, who might say:

*I need random strings 16 characters long.*

Okay. There are libraries available that address that exact need. But first, there are some questions that arise from the need as stated, such as:

  1. What characters do you want to use?
  2. How many of these strings do you need?
  3. Why do you need these strings?

The available libraries often let you specify the characters to use. So we can assume for now that question 1 is answered with:

*Hexadecimal will do fine*.

As for question 2, the developer might respond:

*I need 10,000 of these things*.

Ah, now we're getting somewhere. The answer to question 3 might lead to the further qualification:

*I need to generate 10,000 random, unique IDs*.

And the cat's out of the bag. We're getting at the real need, and it's not the same as the original statement. The developer needs *uniqueness* across a total of some number of strings. The length of the string is a by-product of the uniqueness, not the goal.

As noted in the [Overview](Overview), guaranteeing uniqueness is difficult, so we'll replace that declaration with one of *probabilistic uniqueness* by asking:

  - What risk of a repeat are you willing to accept?

Probabilistic uniqueness contains risk. That's the price we pay for giving up on the stronger declaration of strict uniqueness. But the developer can quantify an appropriate risk for a particular scenario with a statement like:

*I guess I can live with a 1 in a million chance of a repeat*.

So now we've gotten to the developer's real need:

*I need 10,000 random hexadecimal IDs with less than 1 in a million chance of any repeats*.

Not only is this statement more specific, there is no mention of string length. The developer needs probabilistic uniqueness, and strings are to be used to capture randomness for this purpose. As such, the length of the string is simply a by-product of the encoding used to represent the required uniqueness as a string.

How do you address this need using a library designed to generate strings of specified length?  Well, you don't directly, because that library was designed to answer the originally stated need, not the real need we've uncovered. We need a library that deals with probabilistic uniqueness of a total number of some strings. And that's exactly what `entropy-string` does.

Let's use `entropy-string` to help this developer by generating 5 IDs:

  ```js
  const entropy = require('entropy-string')

  let bits = entropy.bits(10000, 1000000)
  let strings = Array()
  for (let i = 0; i < 5; i++) {
    let string = entropy.randomString(bits, entropy.charSet16)
    strings.push(string)
  }
  ```

  > ["85e442fa0e83", "a74dc126af1e", "368cd13b1f6e", "81bf94e1278d", "fe7dec099ac9"]

To generate the IDs, we first use

  ```js
  let bits = entropy.bits(10000, 1000000)
  ```

to determine how much entropy is needed to satisfy the probabilistic uniqueness of a **1 in a million** risk of repeat in a total of **10,000** strings. We didn't print the result, but if you did you'd see it's about **45.51** bits. Then inside a loop we used

  ```js
  let string = entropy.randomString(bits, entropy.charSet16)
  ```

to actually generate a random string of the specified entropy using hexadecimal (charSet16) characters. Looking at the IDs, we can see each is 12 characters long. Again, the string length is a by-product of the characters used to represent the entropy we needed. And it seems the developer didn't really need 16 characters after all.

Finally, given that the strings are 12 hexadecimals long, each string actually has an information carrying capacity of 12 * 4 = 48 bits of entropy (a hexadecimal character carries 4 bits). That's fine. Assuming all characters are equally probable, a string can only carry entropy equal to a multiple of the amount of entropy represented per character. `entropy-string` produces the smallest strings that *exceed* the specified entropy.

[TOC](#TOC)

## <a name="MoreExamples"></a>More Examples

In [Real Need](#RealNeed) our developer used hexadecimal characters for the strings.  Let's look at using other characters instead.

We'll start with using 32 characters. What 32 characters, you ask? Well, the [Character Sets](#CharacterSets) section discusses the default characters available in `entropy-string` and the [Custom Characters](#CustomCharacters) section describes how you can use whatever characters you want. For now we'll stick to the provided defaults.

  ```js
  const entropy = require('entropy-string')

  let bits = entropy.bits(10000, 1000000)
  let string = entropy.randomString(bits, entropy.charSet32)
  ```

  > String: jGjfNbdGQD

We're using the same __bits__ calculation since we haven't changed the number of IDs or the accepted risk of probabilistic uniqueness. But this time we use 32 characters and our resulting ID only requires 10 characters (and can carry 50 bits of entropy).

Now let's suppose we need to ensure the names of a handful of items are unique.  Let's say 30 items. And let's decide we can live with a 1 in 100,000 probability of collision (we're just futzing with some code ideas). Using hex characters:

  ```js
  bits = entropy.bits(30, 100000)
  string = entropy.randomString(bits, entropy.charSet16)
  ```

  > String: dbf40a6

Using 4 characters:

  ```js
  string = entropy.randomString(bits, entropy.charSet4)
  ```

  > String: CGCCGTAGGATAT

Okay, we probably wouldn't use 4 characters (and what's up with those characters?), but you get the idea.

Suppose we have a more extreme need. We want less than a 1 in a trillion chance that 10 billion base 32 strings repeat. Let's see, our risk (trillion) is 10 to the 12th and our total (10 billion) is 10 to the 10th, so:

  ```js
  bits = entropy.bitsWithPowers(10, 12)
  string = entropy.randomString(bits, entropy.charSet32)
  ```

   > String: gQ4F7M2Rmp8GFmtPd9R78d

Finally, let say we're generating session IDs. We're not interested in uniqueness per se, but in ensuring our IDs aren't predicatable since we can't have the bad guys guessing a valid ID. In this case, we're using entropy as a measure of unpredictability of the IDs. Rather than calculate our entropy, we declare it needs to be 128 bits (since we read on some web site that session IDs should be 128 bits).

  ```js
  string = entropy.randomString(128, entropy.charSet64)
  ```

  > String: lstRHhvumC-4DRKM_HAvCk

Using 64 characters, our string length is 22 characters. That's actually 132 bits, so we've got our OWASP requirement covered! 😌

Also note that we covered our need using strings that are only 22 characters in length. So long to using GUID strings which only carry 122 bits of entropy (commonly used version 4) and use string representations that are 36 characters long (hex with dashes).

[TOC](#TOC)

## <a name="CharacterSets"></a>Character Sets

As we've seen in the previous sections, `entropy-string` provides default characters for each of the supported character sets. Let's see what's under the hood.

  ```js
  const entropy = require('entropy-string')
  let chars = entropy.charSet64.chars
  ```

  > ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_

The available charSets are `charSet64`, `charSet32`, `charSet16`, `charSet8`, `charSet4` and `charSet2`. The default characters for each were chosen as follows:

  - CharSet 64: **ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_**
      * The file system and URL safe char set from [RFC 4648](https://tools.ietf.org/html/rfc4648#section-5).
  - CharSet 32: **2346789bdfghjmnpqrtBDFGHJLMNPQRT**
      * Remove all upper and lower case vowels (including y)
      * Remove all numbers that look like letters
      * Remove all letters that look like numbers
      * Remove all letters that have poor distinction between upper and lower case values.
      The resulting strings don't look like English words and are easy to parse visually.

  - CharSet 16: **0123456789abcdef**
      * Hexadecimal
  - CharSet  8: **01234567**
      * Octal
  - CharSet  4: **ATCG**
      * DNA alphabet. No good reason; just wanted to get away from the obvious.
  - CharSet  2: **01**
      * Binary

You may, of course, want to choose the characters used, which is covered next in [Custom Characters](#CustomCharacters).

[TOC](#TOC)

## <a name="CustomCharacters"></a>Custom Characters

Being able to easily generate random strings is great, but what if you want to specify your own characters. For example, suppose you want to visualize flipping a coin to produce entropy of 10 bits.

  ```js
  const entropy = require('entropy-string')
  let flips = entropy.randomString(10, entropy.charSet2)
  ```

  > flips: 1111001011

The resulting string of __0__'s and __1__'s doesn't look quite right. Perhaps you want to use the characters __H__ and __T__ instead.

  ```js
  entropy.charSet2.use('HT')
  flips = entropy.randomString(10, entropy.charSet2)
  ```

  > flips: THHTHTTHHT

As another example, we saw in [Character Sets](#CharacterSets) the default characters for CharSet 16 are **0123456789abcdef**. Suppose you like uppercase hexadecimal letters instead.

  ```js
  entropy.charSet16.use('0123456789ABCDEF')
  let string = entropy.randomString(48, entropy.charSet16)
  
  ```

  > string: 08BB82C0056A

Or suppose you want a random password with numbers, lowercase letters and special characters.

  ```js
  let password = randomString.entropy(of: 64, using: .charSet64)
  print("password: \(password)")
  ```

  > password: .@.i8*)2)?g

`entropy.charSetNN.use(string)` throws an `Error` if the number of characters doesn't match the number required for the CharSet or if the characters are not all unique.

  ```js
  const entropy = require('entropy-string')
  try {
    entropy.charSet8.use('abcdefh')
  }
  catch(error) {
    console.log(error.message)
  }
  ```

  > Invalid character count

  ```js
  try {
    entropy.charSet8.use('01233210')
  }
  catch(error) {
    console.log(error.message)
  }
  ```
  
  > Characters not unique

[TOC](#TOC)

## <a name="Efficiency"></a>Efficiency

To efficiently create random strings, `entropy-string` generates the necessary number of bytes needed for each string and uses those bytes in a bit shifting scheme to index into a character set. For example, consider generating strings from the `.charSet32` character set. There are __32__ characters in the set, so an index into an array of those characters would be in the range `[0,31]`. Generating a random string of `.charSet32` characters is thus reduced to generating a random sequence of indices in the range `[0,31]`.

To generate the indices, `entropy-string` slices just enough bits from the array of bytes to create each index. In the example at hand, 5 bits are needed to create an index in the range `[0,31]`. `entropy-string` processes the byte array 5 bits at a time to create the indices. The first index comes from the first 5 bits of the first byte, the second index comes from the last 3 bits of the first byte combined with the first 2 bits of the second byte, and so on as the byte array is systematically sliced to form indices into the character set. And since bit shifting and addition of byte values is really efficient, this scheme is quite fast.

The `entropy-string` scheme is also efficient with regard to the amount of randomness used. Consider the following common JavaScript solution to generating random strings. To generated a character, an index into the available characters is create using `Math.random`. The code looks something like:

  ```js
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let string = ""
  for(let i = 0; i < length; i++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  ```

There are two significant issues with this code. `Math.random` returns a random `float` value. At the very best this value has about 53-bits of entropy. Let's assume it's 52-bits for argument sake, i.e. `Math.random` generates 52 bits of randomness per call. That randomness is in turn used to create an index. Since there are 62 **chars**, each represents 5.95 bits of entropy. So if we're creating strings with **length=16**, the 16 calls generate a total of 816 bits of randomness which are used to inject a total of 95.2 bits of entropy (5.95/char) into **string**. That means 720 bits (88% of the total) of the generated randomness is simply wasted.

Compare that to the `entropy-string` scheme. For the example above, slicing off 5 bits at a time requires a total of 80 bits (10 bytes). Creating the same strings as above, `entropy-string` uses 80 bits of randomness per string with no wasted bits. In general, the `entropy-string` scheme can waste up to 7 bits per string, but that's the worst case scenario and that's *per string*, not *per character*!

But there is an even bigger issue with the above code from a security perspective. `Math.random` *is not a crytographically strong random number generator*. **_Do not_** use `Math.random` to create secure IDs in a scheme as shown above! This highlights an important point. Strings are only capable of carrying information (entropy); it's the random bytes that actually provide the entropy itself. `entropy-string` automatically generates the necessary number of bytes needed to create a random string using the `crypto` library.

Fortunately you don't need to really understand how the bytes are efficiently sliced and diced to get the string. But you may want to provide your own [Custom Bytes](#CustomBytes) to create a string, which is the next topic.

[TOC](#TOC)

## <a name="CustomBytes"></a>Custom Bytes

As described in [Efficiency](#Efficiency), `entropy-string` automatically generates random bytes using the `crypto` library. But you may have a need to provide your own bytes, say for deterministic testing or to use a specialized byte genterator. The `entropy.randomStringWithBytes` function allows passing in your own bytes to create a string.

Suppose we want a string capable of 30 bits of entropy using 32 characters. We pass in 4 bytes (to cover the 30 bits):

  ```js
  const entropy = require('entropy-string')

  let bytes: RandomString.Bytes = [250, 200, 150, 100]
  let string = entropy.randomStringWithBytes(30, entropy.charSet32, bytes)
  ```

  > string: Th7fjL
 
The __bytes__ provided can come from any source. However, the number of bytes must be sufficient to generate the string as described in the [Efficiency](#Efficiency) section.  `entropy.randomStringWithBytes` throws an `Error` if the string cannot be formed from the passed bytes.

  ```js
  try {
    string = entropy.randomStringWithBytes(32, entropy.charSet32, bytes)
  }
  catch(error) {
    console.log(error.message)
  }
  ```

  > error: Insufficient bytes

Note how the number of bytes needed is dependent on the number of characters in our set. In using a string to represent entropy, we can only have multiples of the bits of entropy per character used. So in the example above, to get at least 32 bits of entropy using a character set of 32 characters (5 bits per char), we'll need enough bytes to cover 35 bits, not 32, so an `error` is thrown.

[TOC](#TOC)
