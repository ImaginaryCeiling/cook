"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  name: string;
}

export function ImageUpload({ name }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // We need to keep track of files manually because file input value is read-only
  // However, for standard form submission, we rely on the input.
  // The simplest way to handle multiple files in a native form submission is to just let the input hold them.
  // But removing a single file from a FileList is hard.
  // For MVP: We will just support "Add photos" and if you want to remove, you clear all.
  // OR we can use a DataTransfer object to update the input files.

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newPreviews: string[] = [];
      Array.from(files).forEach(file => {
        newPreviews.push(URL.createObjectURL(file));
      });
      setPreviews(newPreviews);
    }
  };

  const handleClear = () => {
    setPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        {previews.map((src, index) => (
          <div key={index} className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            <Image
              src={src}
              alt={`Preview ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
        
        {/* Upload Button Block */}
        <div 
          onClick={handleThumbnailClick}
          className="relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
             <Upload className="h-6 w-6" />
             <span className="text-xs font-medium text-center px-1">
               {previews.length > 0 ? "Change" : "Add Photos"}
             </span>
          </div>
        </div>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
        required={previews.length === 0}
      />
      
      {previews.length > 0 && (
         <Button 
           variant="ghost" 
           size="sm" 
           type="button" 
           onClick={handleClear}
           className="self-start text-muted-foreground hover:text-destructive"
         >
           Clear selection
         </Button>
      )}
    </div>
  );
}
