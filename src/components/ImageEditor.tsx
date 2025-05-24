import React, { useState } from "react";

// react-pintura
import { PinturaEditor } from "@pqina/react-pintura";

// pintura
import "@pqina/pintura/pintura.css";

import {
  createDefaultImageReader,
  createDefaultImageWriter,
  createDefaultShapePreprocessor,
  setPlugins,
  plugin_crop,
  plugin_finetune,
  plugin_finetune_defaults,
  plugin_filter,
  plugin_filter_defaults,
  plugin_annotate,
  markup_editor_defaults,
} from "@pqina/pintura";

import {
  LocaleCore,
  LocaleCrop,
  LocaleFinetune,
  LocaleFilter,
  LocaleAnnotate,
  LocaleMarkupEditor,
} from "@pqina/pintura/locale/en_GB";

// Set the plugins
setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);

// Editor configuration
const editorDefaults = {
  utils: ["crop", "finetune", "filter", "annotate"],
  imageReader: createDefaultImageReader(),
  imageWriter: createDefaultImageWriter(),
  shapePreprocessor: createDefaultShapePreprocessor(),
  ...plugin_finetune_defaults,
  ...plugin_filter_defaults,
  ...markup_editor_defaults,
  locale: {
    ...LocaleCore,
    ...LocaleCrop,
    ...LocaleFinetune,
    ...LocaleFilter,
    ...LocaleAnnotate,
    ...LocaleMarkupEditor,
  },
};

export default function Example(): JSX.Element {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
    }
  };

  return (
    <div>
      <h2>Pintura Editor Example</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {imageSrc && (
        <div style={{ height: "70vh", marginTop: "1rem" }}>
          <PinturaEditor
            {...editorDefaults}
            src={imageSrc}
            onLoad={(res: any) => console.log("Image loaded", res)}
            onProcess={({ dest }: { dest: Blob }) =>
              setResult(URL.createObjectURL(dest))
            }
          />
        </div>
      )}

      {result && (
        <div>
          <h3>Edited Image</h3>
          <img src={result} alt="Edited result" />
        </div>
      )}
    </div>
  );
}
