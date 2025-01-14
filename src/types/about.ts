export interface AboutType {
  id: number;
  title: string;
  content: {
    root: {
      children: Array<{
        [key: string]: unknown;
        type: string;
        version: number;
      }>;
      direction: "ltr" | "rtl" | null;
      format: "" | "left" | "start" | "center" | "right" | "end" | "justify";
      indent: number;
      version: number;
    };
  };
  image: {
    id: number;
    url: string;
  };
}
