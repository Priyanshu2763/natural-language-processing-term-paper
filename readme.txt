Spell Checker Using Edit Distance
This project implements a simple spell checker using Edit Distance to suggest corrections for misspelled words. The system relies on a large English corpus (big.txt) to build a vocabulary and calculate word probabilities, improving the accuracy of suggestions.

Features
Corpus Reading:

Reads a text file to create a word corpus.
Converts all words to lowercase and removes punctuation using regex.
Calculates the frequency of each word to determine probabilities.
Edit Operations:

Supports single-edit operations: delete, swap, replace, and insert.
Generates possible corrections by applying these operations to the input word.
Implements level one (single-edit) and level two (two-edit) edits.
Spelling Correction:

Checks if the input word is already correctly spelled.
Generates suggestions based on the edit distance.
Ranks corrections using probabilities from the corpus to find the most likely match.
How to Use
Load a large text file (big.txt) to build the word corpus.
Use the correct_spelling function to input a word and get spelling suggestions.
The function will suggest the most probable correction based on the word's frequency in the corpus.
Example
search_word = "loed"
guess = correct_spelling(search_word, vocab, word_probabs)
print(guess)  # Output: [('load', probability), ('lode', probability)]
Dependencies
re for regex operations.
collections.Counter for counting word frequency.
string for handling characters in replacement operations.
Basic knowledge of Python data structures.
File Structure
big.txt: A large text file serving as the corpus for word frequency analysis.
spell_checker.py: Main script for handling spelling corrections.
This project is open-source and available under the MIT License.