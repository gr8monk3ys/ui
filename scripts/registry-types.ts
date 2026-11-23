export interface RegistryFile {
  path: string;
  type: string;
  target?: string;
  content?: string;
}

export interface RegistryItem {
  name: string;
  type?: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  cssVars?: Record<string, Record<string, string>>;
  files: RegistryFile[];
}

export interface RegistryFileJson {
  items: RegistryItem[];
}

export interface Manifest {
  items: string[];
}
