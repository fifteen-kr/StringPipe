function createSaveFilePickerOptions(file_name: string, _blob: Blob): SaveFilePickerOptions {
    return {
        suggestedName: file_name,
    };
}

async function _openFileViaFilePicker(options: OpenFilePickerOptions): Promise<File[]> {
    if(typeof window.showOpenFilePicker !== 'function') {
        throw new Error("Open file picker is not supported!");
    }

    try {
        const handles = await window.showOpenFilePicker(options);
        return Promise.all(handles.map((handle) => handle.getFile()));
    } catch(e) {
        if(e instanceof Error && e.name === 'AbortError') return [];
        throw e;
    }
}

async function openFileViaInputElement(accept: string = "", multiple: boolean = false): Promise<File[]> {
    return new Promise((resolve) => {
        const inputElement = window.document.createElement('input');
        inputElement.type = 'file';

        if(accept) inputElement.accept = accept;
        inputElement.multiple = multiple;

        inputElement.addEventListener('change', () => {
            const files = inputElement.files ?? [];
            resolve([...files]);
        });

        inputElement.addEventListener('cancel', () => {
            resolve([]);
        });

        inputElement.click();
    });
}

export async function openFile(accept: string="", multiple: boolean = false): Promise<File[]> {
    return await openFileViaInputElement(accept, multiple);
}

async function saveFileViaFilePicker(options: SaveFilePickerOptions, blob: Blob): Promise<void> {
    if(typeof window.showSaveFilePicker !== 'function') {
        throw new Error("Save file picker is not supported!");
    }

    let handle: FileSystemFileHandle;
    try {
        handle = await window.showSaveFilePicker(options);
    } catch(e) {
        if(e instanceof Error && e.name === 'AbortError') return;
        throw e;
    }

    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
}

async function saveFileViaAnchorElement(file_name: string, blob: Blob): Promise<void> {
    const {document} = window;
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);

    a.href = url;
    a.download = file_name ?? "output.txt";
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

export async function saveFile(file_name: string, contents: string, file_type?: string): Promise<void>;
export async function saveFile(file_name: string, blob: Blob): Promise<void>;
export async function saveFile(file_name: string, contents: object): Promise<void>;

export async function saveFile(file_name: string, contents: Blob|string|object, file_type?: string): Promise<void> {
    let blob: Blob;
    if(contents instanceof Blob) {
        blob = contents;
    } else if(typeof contents === 'string') {
        blob = new Blob([contents], {type: file_type ?? 'text/plain'});
    } else {
        blob = new Blob([JSON.stringify(contents)], {type: file_type ?? 'application/json'});
    }

    if(typeof window.showSaveFilePicker === 'function') {
        await saveFileViaFilePicker(createSaveFilePickerOptions(file_name, blob), blob);
    } else {
        await saveFileViaAnchorElement(file_name, blob);
    }
}