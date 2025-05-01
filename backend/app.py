from Services import create_app
#from Services.langgraph_service import generate_text, store_embeddings


app = create_app()

# -------------------------------------------------- LLM -------------------------------------------------- #
#@app.route('/api/generate', methods=['POST'])
#def generate():
    #prompt = "This is a test prompt"
    #result = generate_text(prompt)
    #return jsonify({"result": result})



# -------------------------------------------------- INIT -------------------------------------------------- #
if __name__ == '__main__':
    app.run(debug=True)
