import os
import glob
import shutil
from google.colab import drive
from transformers import GPT2LMHeadModel, GPT2Tokenizer, TextDataset, DataCollatorForLanguageModeling
from transformers import Trainer, TrainingArguments
import torch
import re
import onnx
import onnxruntime as ort

# Disable wandb
os.environ["WANDB_DISABLED"] = "true"

# Mount Google Drive
drive.mount('/content/drive')

# Set device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

def clean_text(text):
    """Clean and format the text for better training"""
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r' +', ' ', text)
    text = re.sub(r'[^a-zA-Z0-9\s.,!?\'"-]', '', text)
    return text.strip()

def load_data(zip_path):
    """Load and process story data from a zip file"""
    os.makedirs('/content/data', exist_ok=True)

    if not os.path.exists(zip_path):
        raise ValueError(f"Zip file not found at: {zip_path}")

    print(f"Extracting zip file from: {zip_path}")
    shutil.unpack_archive(zip_path, '/content/data')

    all_text = []
    txt_files = glob.glob("/content/data/**/*.txt", recursive=True)

    if not txt_files:
        raise ValueError("No .txt files found in the zip file!")

    for story_file in txt_files:
        try:
            label = os.path.splitext(os.path.basename(story_file))[0]
            with open(story_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = clean_text(f.read())
                if not content:
                    print(f"Warning: Empty file found: {story_file}")
                    continue
                formatted_text = f"<|startoftext|>\nTitle: {label}\nStory:\n{content}\n<|endoftext|>\n"
                all_text.append(formatted_text)
        except Exception as e:
            print(f"Error processing file {story_file}: {str(e)}")

    if not all_text:
        raise ValueError("No valid story content found in the text files!")

    with open('training_data.txt', 'w', encoding='utf-8') as f:
        f.write("\n".join(all_text))

    shutil.rmtree('/content/data')

    return 'training_data.txt'

def setup_model():
    """Initialize and set up the model and tokenizer"""
    tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
    special_tokens = {
        'pad_token': '[PAD]',
        'bos_token': '<|startoftext|>',
        'eos_token': '<|endoftext|>'
    }
    tokenizer.add_special_tokens(special_tokens)
    model = GPT2LMHeadModel.from_pretrained('gpt2')
    model.resize_token_embeddings(len(tokenizer))
    model = model.to(device)
    return model, tokenizer

def export_to_onnx(model, tokenizer):
    """Export the trained model to ONNX format"""
    dummy_input = torch.ones(1, 10, dtype=torch.long).to(device)
    output_path = "./story_model.onnx"
    torch.onnx.export(
        model,
        dummy_input,
        output_path,
        input_names=["input_ids"],
        output_names=["logits"],
        dynamic_axes={"input_ids": {0: "batch_size", 1: "sequence_length"}},
        opset_version=11
    )
    print(f"Model exported to ONNX format at {output_path}")


def train_model(train_file, model, tokenizer):
    """Train the model on the prepared dataset"""
    dataset = TextDataset(
        tokenizer=tokenizer,
        file_path=train_file,
        block_size=128
    )

    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer,
        mlm=False
    )

    training_args = TrainingArguments(
        output_dir="./story_model",
        overwrite_output_dir=True,
        num_train_epochs=3,
        per_device_train_batch_size=2,
        save_steps=10,
        save_total_limit=2,
        learning_rate=2e-5,
        warmup_steps=100,
        no_cuda=(not torch.cuda.is_available())
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        data_collator=data_collator,
        train_dataset=dataset,
    )

    trainer.train()
    model.save_pretrained('./story_model')
    tokenizer.save_pretrained('./story_model')
    export_to_onnx(model, tokenizer)


def generate_story(prompt, onnx_model_path, tokenizer, max_length=200):
    """Generate a story using the ONNX model"""
    session = ort.InferenceSession(onnx_model_path)
    inputs = tokenizer.encode(f"<|startoftext|>\n{prompt}", return_tensors='pt').to(device)
    ort_inputs = {session.get_inputs()[0].name: inputs.cpu().numpy()}
    ort_outs = session.run(None, ort_inputs)

    logits = torch.tensor(ort_outs[0])
    generated_ids = torch.argmax(logits, dim=-1).squeeze()
    story = tokenizer.decode(generated_ids, skip_special_tokens=True)
    return story

def main():
    try:
        zip_path = '/content/drive/MyDrive/storie1.zip'
        train_file = load_data(zip_path)
        model, tokenizer = setup_model()
        train_model(train_file, model, tokenizer)

        onnx_model_path = "./story_model.onnx"
        print("\nTesting story generation...")
        prompt = "Title: The Mystery of the Old House"
        story = generate_story(prompt, onnx_model_path, tokenizer)
        print(f"\nGenerated Story:\n{story}")

    except Exception as e:
        print(f"\nError occurred: {str(e)}")

if __name__ == "__main__":
    main()
