## EntropyString for JavaScript

[![npm version](https://badge.fury.io/js/entropy-string.svg)](https://www.npmjs.com/package/entropy-string) &nbsp; [![Build Status](https://travis-ci.org/EntropyString/JavaScript.svg?branch=master)](https://travis-ci.org/EntropyString/JavaScript) &nbsp; [![License: ISC](https://cdn.rawgit.com/EntropyString/JavaScript/8bcbc005/ISC.svg)](https://en.wikipedia.org/wiki/ISC_license)

Efficiently generate cryptographically strong random strings of specified entropy from various character sets.

### <a name="TOC"></a>TOC
 - [Installation](#Installation)
 - [TL;DR](#TLDR)
 - [Overview](#Overview)
 - [Real Need](#RealNeed)
 - [More Examples](#MoreExamples)
 - [Character Sets](#CharacterSets)
 - [Custom Characters](#CustomCharacters)
 - [Efficiency](#Efficiency)
 - [Custom Bytes](#CustomBytes)
 - [TL;DR 2](#TLDR2)

### <a name="Installation"></a>Installation

##### Yarn

```bash
  yarn add entropy-string
```

##### NPM

```bash
  npm install entropy-string
```

[TOC](#TOC)

### <a name="TLDR"></a>TL;DR

##### Examples

Run any of the examples in the `examples` directory by:

  ```bash
  yarn examples
  node examples/dist/tldr_1.js
  ```

##### Usage

Generate a potential of _1 million_ random strings with _1 in a billion_ chance of repeat:

  ```js
  import {Random, Entropy} from 'entropy-string'
  
  const random = new Random()
  const bits = Entropy.bits(1e6, 1e9)

  const string = random.string(bits)
  ```

  > pbbnBD4MQ3rbRN
  
See [Real Need](#RealNeed) for description of what entropy bits represents.  

`EntropyString` uses predefined `charset32` characters by default (see [Character Sets](#CharacterSets)). To get a random hexadecimal string with the same entropy `bits` as above:

  ```js
  import {Random, Entropy, charSet16} from 'entropy-string'
  
  const random = new Random(charSet16)
  const bits = Entropy.bits(1e6, 1e9)
  
  const string = random.string(bits)
  ```

  > 878114ac513a538e22

Custom characters may be specified. Using uppercase hexadecimal characters:

  ```js
  import {Random, Entropy} from 'entropy-string'
  
  const random = new Random('0123456789ABCDEF')
  const bits = Entropy.bits(1e6, 1e9)
  
  const string = random.string(bits)
  ```

  > 16E26779479356B516
  
Convenience functions `smallID`, `mediumID`, `largeID`, `sessionID` and `token` provide random strings for various predefined bits of entropy.

Small ID represents a potential of 30 strings with a 1 in a million chance of repeat:

  ```js
  import {Random} from 'entropy-string'
  
  const random = new Random()
  const string = random.smallID()
  ```

OWASP session ID using base 32 characters:

  ```js
  import {Random} from 'entropy-string'
  
  const random = new Random()
  const string = random.sessionID()
  ```

  > nqqBt2P669nmjPQRqh4NtmTPn9
  
OWASP session ID using [RFC 4648](https://tools.ietf.org/html/rfc4648#section-5) file system and URL safe characters:
  ```js
  import {Random, charSet64} from 'entropy-string'
  
  const random = new Random(charSet64)
  const string = random.sessionID()
  ```

  > HRU1M7VR5u-N6B0Xo4ZSjx

Base 64 character, 256-bit token

  ```js
  import {Random, Entropy, charSet64} from 'entropy-string'

  const random = new Random(charSet64)

  const string = random.string(bits)
  ```

  > t-Z8b9FLvpc-roln2BZnGYLZAX_pn5U7uO_cbfldsIt

[TOC](#TOC)

### <a name="Overview"></a>Overview

`entropy-string` provides easy creation of randomly generated strings of specific entropy using various character sets. Such strings are needed when generating, for example, random IDs and you don't want the overkill of a GUID, or for ensuring that some number of items have unique identifiers.

A key concern when generating such strings is that they be unique. To truly guarantee uniqueness requires either deterministic generation (e.g., a counter) that is not random, or that each newly created random string be compared against all existing strings. When ramdoness is required, the overhead of storing and comparing strings is often too onerous and a different tack is needed.

A common strategy is to replace the *guarantee of uniqueness* with a weaker but often sufficient *probabilistic uniqueness*. Specifically, rather than being absolutely sure of uniqueness, we settle for a statement such as *"there is less than a 1 in a billion chance that two of my strings are the same"*. This strategy requires much less overhead, but does require we have some manner of qualifying what we mean by, for example, *"there is less than a 1 in a billion chance that 1 million strings of this form will have a repeat"*.

Understanding probabilistic uniqueness requires some understanding of [*entropy*](https://en.wikipedia.org/wiki/Entropy_(information_theory)) and of estimating the probability of a [*collision*](https://en.wikipedia.org/wiki/Birthday_problem#Cast_as_a_collision_problem) (i.e., the probability that two strings in a set of randomly generated strings might be the same).  Happily, you can use `entropy-string` without a deep understanding of these topics.

We'll begin investigating `entropy-string` by considering our [Real Need](#RealNeed) when generating random strings.

[TOC](#TOC)

### <a name="RealNeed"></a>Real Need

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

And the cat's out of the bag. We're getting at the real need, and it's not the same as the original statement. The developer needs *uniqueness* across a total of some number of strings. The length of the string is a by-product of the uniqueness, not the goal, and should not be the primary specification for the random string.

As noted in the [Overview](#Overview), guaranteeing uniqueness is difficult, so we'll replace that declaration with one of *probabilistic uniqueness* by asking:

  - What risk of a repeat are you willing to accept?

Probabilistic uniqueness contains risk. That's the price we pay for giving up on the stronger declaration of strict uniqueness. But the developer can quantify an appropriate risk for a particular scenario with a statement like:

*I guess I can live with a 1 in a million chance of a repeat*.

So now we've gotten to the developer's real need:

*I need 10,000 random hexadecimal IDs with less than 1 in a million chance of any repeats*.

Not only is this statement more specific, there is no mention of string length. The developer needs probabilistic uniqueness, and strings are to be used to capture randomness for this purpose. As such, the length of the string is simply a by-product of the encoding used to represent the required uniqueness as a string.

How do you address this need using a library designed to generate strings of specified length?  Well, you don't directly, because that library was designed to answer the originally stated need, not the real need we've uncovered. We need a library that deals with probabilistic uniqueness of a total number of some strings. And that's exactly what `entropy-string` does.

Let's use `entropy-string` to help this developer generate 5 IDs:

  ```js
  import {Random, Entropy, charSet16} from 'entropy-string'

  const random = new Random(charSet16)
  const bits = Entropy.bits(10000, 1000000)
  const strings = Array()
  for (let i = 0; i < 5; i++) {
     string = random.string(bits)
    strings.push(string)
  }
  ```

  > ["85e442fa0e83", "a74dc126af1e", "368cd13b1f6e", "81bf94e1278d", "fe7dec099ac9"]

To generate the IDs, we first use

  ```js
  const bits = Entropy.bits(10000, 1000000)
  ```

to determine how much entropy is needed to satisfy the probabilistic uniqueness of a **1 in a million** risk of repeat in a total of **10,000** strings. We didn't print the result, but if you did you'd see it's about **45.51** bits. 

The following line creates a `Random` instance configured to generated strings using the predefined hexadecimal characters provided by `charSet16`:

  ```js
  const random = new Random(charSet16)
  ```

Then inside a loop we used

  ```js
  const string = random.string(bits)
  ```

to actually generate a random string of the specified entropy. Looking at the IDs, we can see each is 12 characters long. Again, the string length is a by-product of the characters used to represent the entropy we needed. And it seems the developer didn't really need 16 characters after all.

Finally, given that the strings are 12 hexadecimals long, each string actually has an information carrying capacity of `12 * 4 = 48` bits of entropy (a hexadecimal character carries 4 bits). That's fine. Assuming all characters are equally probable, a string can only carry entropy equal to a multiple of the amount of entropy represented per character. `entropy-string` produces the smallest strings that *exceed* the specified entropy.

[TOC](#TOC)

### <a name="MoreExamples"></a>More Examples

In [Real Need](#RealNeed) our developer used hexadecimal characters for the strings.  Let's look at using other characters instead.

We'll start with using 32 characters. What 32 characters, you ask? The [Character Sets](#CharacterSets) section discusses the predefined characters available in `entropy-string` and the [Custom Characters](#CustomCharacters) section describes how you can use whatever characters you want. By default, `entropy-string` uses `charSet32` characters, so we don't need to pass that parameter into `new Random()`.

  ```js
  import {Random, Entropy} from 'entropy-string'

  const random = new Random()
  const bits = Entropy.bits(10000, 1e6)
  const string = random.string(bits)
  ```

  > String: MD8r3BpTH3

We're using the same `Entropy.bits` calculation since we haven't changed the number of IDs or the accepted risk of probabilistic uniqueness. But this time we use 32 characters and our resulting ID only requires 10 characters (and can carry 50 bits of entropy).

As another example, let's assume we need to ensure the names of a handful of items are unique.  Let's say 30 items. And suppose we decide we can live with a 1 in 100,000 probability of collision (we're just futzing with some coding ideas). Using the predefined provided hex characters:

  ```js
  import {Random, Entropy, charSet16, charSet4} from 'entropy-string'

  const random = new Random(charSet16)
  const bits = Entropy.bits(30, 100000)
  const string = random.string(bits)
  ```

  > String: dbf40a6

Using the same `Random` instance, we can switch to the predefined `charSet4` characters and generate a string of the same amount of entropy:

  ```js
  random.use(charSet4)
  string = random.string(bits)
  ```

  > String: CAATAGTGGACTG

Okay, we probably wouldn't use 4 characters (and what's up with those characters?), but you get the idea.

Suppose we have a more extreme need. We want less than a 1 in a trillion chance that 10 billion base 32 strings repeat. Let's see, our total (10 billion) is 10<sup>10</sup> and our risk (1 trillion) is 10<sup>12</sup>, so:

  ```js
  import {Random, Entropy} from 'entropy-string'

  const random = new Random()
  const bits = Entropy.bits(1e10, 1e12)
  const string = random.string(bits)
  ```

   > String: 4J86pbFG9BqdBjTLfD3rt6

Finally, let say we're generating session IDs. Since session IDs are ephemeral, we aren't interested in uniqueness per se, but in ensuring our IDs aren't predictable since we can't have the bad guys guessing a valid session ID. In this case, we're using entropy as a measure of unpredictability of the IDs. Rather than calculate our entropy, we declare it as 128 bits (since we read on the OWASP web site that session IDs should be 128 bits).

  ```js
  import {Random} from 'entropy-string'

  const random = new Random()
  const string = random.string(128)
  ```

  > String: Rm9gDFn6Q9DJ9rbrtrttBjR97r
            
Since session ID are such an important need, `entropy-string` provides a convenience function for generating them:

  ```js
  import {Random, charSet64} from 'entropy-string'

  const random = new Random(charSet64)
  const string = random.sessionID()

  ```

  > String: DUNB7JHqXCibGVI5HzXVp2

In using 64 characters, note our string length is 22 characters. That's actually `22*6 = 132` bits, so we've got our OWASP session ID requirement covered!

[TOC](#TOC)

### <a name="CharacterSets"></a>Character Sets

As we've seen in the previous sections, `entropy-string` provides predefined character sets. Let's see what's under the hood.

  ```js
  import {charSet64} from 'entropy-string'
  const chars = charSet64.chars()
  ```

  > ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_

The available `CharSet`s are *charSet64*, *charSet32*, *charSet16*, *charSet8*, *charSet4* and *charSet2*. The predefined characters for each were chosen as follows:

  - CharSet 64: **ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_**
      * The file system and URL safe char set from [RFC 4648](https://tools.ietf.org/html/rfc4648#section-5).
      &nbsp;
  - CharSet 32: **2346789bdfghjmnpqrtBDFGHJLMNPQRT**
      * Remove all upper and lower case vowels (including y)
      * Remove all numbers that look like letters
      * Remove all letters that look like numbers
      * Remove all letters that have poor distinction between upper and lower case values.
      The resulting strings don't look like English words and are easy to parse visually.
      &nbsp;
  - CharSet 16: **0123456789abcdef**
      * Hexadecimal
      &nbsp;
  - CharSet  8: **01234567**
      * Octal
      &nbsp;
  - CharSet  4: **ATCG**
      * DNA alphabet. No good reason; just wanted to get away from the obvious.
      &nbsp;
  - CharSet  2: **01**
      * Binary

You may, of course, want to choose the characters used, which is covered next in [Custom Characters](#CustomCharacters).

[TOC](#TOC)

### <a name="CustomCharacters"></a>Custom Characters

Being able to easily generate random strings is great, but what if you want to specify your own characters. For example, suppose you want to visualize flipping a coin to produce entropy of 10 bits.

  ```js
  import {Random, charSet2} from 'entropy-string'

  const random = new Random(charSet2)
  let flips = random.string(10)
  ```

  > flips: 1111001011

The resulting string of __0__'s and __1__'s doesn't look quite right. Perhaps you want to use the characters __H__ and __T__ instead.

  ```js
  random.useChars('HT')
  flips = random.string(10)
  ```

  > flips: THHTHTTHHT

As another example, we saw in [Character Sets](#CharacterSets) the predefined hex characters for `charSet16` are lowercase. Suppose you like uppercase hexadecimal letters instead.

  ```js
  import {Random} from 'entropy-string'

  const random = new Random('0123456789ABCDEF')
  const string = random.string(48)
  
  ```

  > string: 08BB82C0056A

The `Random` constructor allows for three separate cases:

  - No argument defauls to the `charSet32` characters.
  - One of six predefined `CharSet`s can be specified.
  - A string representing the characters to use can be specified.

The last option above will throw an `EntropyStringError` if the characters string isn't appropriate for creating a `CharSet`.
  ```js
  import {Random} from 'entropy-string'

  try {
    const random = new Random('123456')
  }
  catch(error) {
    console.log('Error: ' + error.message)
  }
  ```

  > Invalid character count: must be one of 2,4,8,16,32,64

  ```js
  try {
    const random = new Random('01233210')
  }
  catch(error) {
    console.log(error.message)
  }
  ```
  
  > Characters not unique

[TOC](#TOC)

### <a name="Efficiency"></a>Efficiency

To efficiently create random strings, `entropy-string` generates the necessary number of bytes needed for each string and uses those bytes in a bit shifting scheme to index into a character set. For example, consider generating strings from the `charSet32` character set. There are __32__ characters in the set, so an index into an array of those characters would be in the range `[0,31]`. Generating a random string of `charSet32` characters is thus reduced to generating a random sequence of indices in the range `[0,31]`.

To generate the indices, `entropy-string` slices just enough bits from the array of bytes to create each index. In the example at hand, 5 bits are needed to create an index in the range `[0,31]`. `entropy-string` processes the byte array 5 bits at a time to create the indices. The first index comes from the first 5 bits of the first byte, the second index comes from the last 3 bits of the first byte combined with the first 2 bits of the second byte, and so on as the byte array is systematically sliced to form indices into the character set. And since bit shifting and addition of byte values is really efficient, this scheme is quite fast.

The `entropy-string` scheme is also efficient with regard to the amount of randomness used. Consider the following common JavaScript solution to generating random strings. To generate a character, an index into the available characters is create using `Math.random`. The code looks something like:

  ```js
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let string = ""
  for(let i = 0; i < length; i++) {
    string += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  ```

  > bl0mvxXAqXuz5R3N

There are two significant issues with this code. `Math.random` returns a random `float` value. At the very best this value has about 53-bits of entropy. Let's assume it's 52-bits for argument sake, i.e. `Math.random` generates 52 bits of randomness per call. That randomness is in turn used to create an index into the 62 **chars**, each which represents 5.95 bits of entropy. So if we're creating strings with **length=16**, the 16 calls generate a total of `16*52 = 816` bits of randomness which are used to inject a total of 95.2 bits of entropy (5.95/char) into **string**. That means 720 bits (88% of the total) of the generated randomness is simply wasted.

Compare that to the `entropy-string` scheme. For the example above, slicing off 5 bits at a time requires a total of 80 bits (10 bytes). Creating the same strings as above, `entropy-string` uses 80 bits of randomness per string with no wasted bits. In general, the `entropy-string` scheme can waste up to 7 bits per string, but that's the worst case scenario and that's *per string*, not *per character*!

  ```js
  import {Random} from 'entropy-string'

  const random = new Random()
  let string = random.string(80)
  ```
  
  > HFtgHQ9q9fH6B8HM
  
But there is an even bigger issue with the previous code from a security perspective. `Math.random` *is not a cryptographically strong random number generator*. **_Do not_** use `Math.random` to create strings used for security purposes! This highlights an important point. Strings are only capable of carrying information (entropy); it's the random bytes that actually provide the entropy itself. `entropy-string` automatically generates the necessary bytes needed to create cryptographically strong random strings using the `crypto` library.

However, if you don't need cryptographically strong random strings, you can request `entropy-string` use `Math.random` rather than the `crypto` library by using `random.stringRandom`:

  ```js
  string = random.stringRandom(80)
  ```
  
  > fdRp9Q3rTMF7TdFN
  
When using `Math.random`, the `entropy-string` scheme uses 48 of the 52(ish) bits of randomness from each call to `Math.random`. That's much more efficient than the previous code snippet but a bit less so than using bytes from `crypto`.

Fortunately you don't need to really understand how the bytes are efficiently sliced and diced to get the string. But you may want to provide your own [Custom Bytes](#CustomBytes) to create a string, which is the next topic.

[TOC](#TOC)

### <a name="CustomBytes"></a>Custom Bytes

As described in [Efficiency](#Efficiency), `entropy-string` automatically generates random bytes using the `crypto` library. But you may have a need to provide your own bytes, say for deterministic testing or to use a specialized byte generator. The `random.string` function allows passing in your own bytes to create a string.

Suppose we want a string capable of 30 bits of entropy using 32 characters. We pass in 4 bytes to cover the 30 bits needed to generate six base 32 characters:

  ```js
  import {Random} from 'entropy-string'

  const random = new Random()
  const bytes = Buffer.from([250, 200, 150, 100])
  let string = random.stringWithBytes(30, bytes)
  ```

  > Th7fjL
 
The __bytes__ provided can come from any source. However, the number of bytes must be sufficient to generate the string as described in the [Efficiency](#Efficiency) section.  `random.stringWithBytes` throws an `Error` if the string cannot be formed from the passed bytes.

  ```js
  try {
    string = random.stringWithBytes(32, bytes)
  }
  catch(error) {
    console.log('  Error: ' + error.message)
  }
  ```

  > error: Insufficient bytes: need 5 and got 4

Note the number of bytes needed is dependent on the number of characters in our set. In using a string to represent entropy, we can only have multiples of the bits of entropy per character used. So in the example above, to get at least 32 bits of entropy using a character set of 32 characters (5 bits per char), we'll need enough bytes to cover 35 bits, not 32, so an `Error` is thrown.

[TOC](#TOC)

### <a name="TLDR2"></a>TL;DR 2

#### Take Away

  - Don't specify randomness using strings of length.
    - String length is a by-product, not a goal.
  - Don't require truly uniqueness.
    - You'll do fine with probabilistically uniqueness.
  - Probabilistic uniqueness involves specified risk.
    - Risk is specified as *"1 in __n__ chance of generating a repeat"*
  - Do specify bits of entropy.
    - Specified as the risk of repeat in a total number of strings
  - Characters used are arbitrary.
  - You need `entropy-string`.
  
##### Base 32 character string with a 1 in a million chance of a repeat a billion strings:
  ```js
  import {Random, Entropy} from 'entropy-string'
  
  const random = new Random()
  const bits = Entropy.bits(1e6,1e9)
  const string = random.string(bits)
  ```

  > DdHrT2NdrHf8tM
  
[TOC](#TOC)
