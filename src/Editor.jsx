import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

function Editor({ value, onChange }) {
    const modules = {
        toolbar: [
            [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            ['link', 'image'],
            [{ 'align': [] }],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'list', 'bold', 'italic', 'underline', 
        'strike', 'blockquote', 'link', 'image', 'align'
    ];

    return (
        <ReactQuill 
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
        />
    );
}

export default Editor;
