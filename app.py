import string
import re
import numpy as np
from collections import Counter
import gradio as gr

# -------------------- Model Setup --------------------
def read_corpus(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        lines = file.readlines()
        words = []
        for word in lines:
            words += re.findall(r'\w+', word.lower())
    return words

corpus = read_corpus("big.txt")   # <-- Make sure big.txt is uploaded
words_count = Counter(corpus)
total_words_count = float(sum(words_count.values()))
vocab = set(corpus)
word_probabs = {word: words_count[word] / total_words_count for word in words_count.keys()}

# -------------------- Edit Functions --------------------
def split(word): return [(word[:i], word[i:]) for i in range(len(word) + 1)]
def delete(word): return [L + R[1:] for L, R in split(word) if R]
def swap(word): return [L + R[1] + R[0] + R[2:] for L, R in split(word) if len(R) > 1]
def replace(word): return [L + c + R[1:] for L, R in split(word) if R for c in string.ascii_lowercase]
def insert(word): return [L + c + R for L, R in split(word) for c in string.ascii_lowercase]

def level_one_edits(word): return set(delete(word) + swap(word) + replace(word) + insert(word))
def level_two_edits(word): return set(e2 for e1 in level_one_edits(word) for e2 in level_one_edits(e1))

# -------------------- Spell Corrector --------------------
def correct_spelling(word):
    word = word.lower().strip()
    if word in vocab:
        return ["✅ The word is already spelled correctly!"]

    suggestions = level_one_edits(word) or level_two_edits(word) or [word]
    best_guesses = [w for w in suggestions if w in vocab]
    best_guesses = sorted(
        [(w, word_probabs[w]) for w in best_guesses],
        key=lambda x: x[1],
        reverse=True
    )[:5]

    if not best_guesses:
        return [("No suggestions found", 0.0)]

    return best_guesses

# -------------------- Gradio Interface --------------------
def predict(word):
    results = correct_spelling(word)
    output = "\n".join([f"{w} (prob: {p:.6f})" for w, p in results])
    return output

iface = gr.Interface(
    fn=predict,
    inputs=gr.Textbox(label="Enter a word", placeholder="Type here..."),
    outputs=gr.Textbox(label="Suggestions"),
    title="Spell Corrector",
    description="Enter a misspelled word and get the top 5 most probable corrections with probabilities."
)

if __name__ == "__main__":
    iface.launch()
