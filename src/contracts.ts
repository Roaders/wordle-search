export interface IWordleSearchArgs {
    length: number;
    known?: string;
    include?: string;
    exclude?: string;
    maxDisplayCount: number;
    help: boolean;
}
