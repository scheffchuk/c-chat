import { useCallback, useEffect, useRef } from "react";
import { useWindowSize } from "usehooks-ts";

export default function MultimodalInput() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }
  }, []);

  useEffect(() =>{
    if (textareaRef.current) {
      adjustHeight();
    }
  },[adjustHeight])

  

  return (
    <div className="relative"></div>
  )
}
