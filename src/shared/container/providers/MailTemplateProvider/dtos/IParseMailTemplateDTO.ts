interface ITemplateVariables {
  [key: string]: string | number;
} // pode receber qualquer coisa

export default interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}
