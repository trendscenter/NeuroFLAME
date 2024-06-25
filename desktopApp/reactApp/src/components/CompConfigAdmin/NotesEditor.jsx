import React, { useState, useEffect } from "react";
import { Editor } from "draft-js";

export default ({ value, setValue }) => {
  return <Editor editorState={value} onChange={setValue} />;
};