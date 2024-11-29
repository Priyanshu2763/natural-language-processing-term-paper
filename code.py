import string
import re
import numpy as np
from collections import Counter
def read_corpus(filename):
    with open(filename,'r',encoding='utf-8') as file:
        lines = file.readlines()

        words = []
        for word in lines:
            words += re.findall(r'\w+',word.lower())
    return words

#
corpus = read_corpus(r'big.txt')
len(corpus)
vocab = set(corpus)
len(vocab)
words_count = Counter(corpus)
words_count
total_words_count = float(sum(words_count.values()))
word_probabs = {word:words_count[word] / total_words_count for word in words_count.keys()}
word_probabs['the']
def split(word):
    return [ (word[:i], word[i:])  for i in range(len(word) + 1)]
print(split('why'))
def delete(word):
    return [left + right[1:] for left,right in split(word) if right]
print(delete('why'))
def swap(word):
    return [left + right[1] + right[0] + right[2:] for left,right in split(word) if len(right) > 1 ]
print(swap('why'))
def replace(word): # abcdef...z
    return [left + center + right[1:] for left, right in split(word) if right for center in string.ascii_lowercase]
print(replace('why'))
def insert(word):
    return [left + center + right for left, right in split(word) for center in string.ascii_lowercase]
print(replace('love'))
def level_one_edits(word):
    return set((delete(word) + swap(word) + replace(word) + insert(word)))
print(level_one_edits('load'))
def level_two_edits(word):
    return set(e2  for e1 in level_one_edits(word) for e2 in level_one_edits(e1))
print(level_two_edits('cut'))
def correct_spelling(word,vocab,word_probabs):
    if word in vocab:
        print(f"{word} is already correctly spelled")
        return
    #getting all suggesions
    suggestions = level_one_edits(word) or level_two_edits(word) or [word]
    best_guesses = [w for w in suggestions if w in vocab]
    return [(w, word_probabs[w]) for w in best_guesses]
search_word = "loed"
guess = correct_spelling(search_word,vocab,word_probabs)
print(guess)