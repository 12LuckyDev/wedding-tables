export const readFileContent = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const content = event.target?.result;
      resolve((content as string) ?? '');
    };

    reader.onerror = () => reject();

    reader.readAsText(file);
  });
};
