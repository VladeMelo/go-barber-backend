import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>; // retorna a template junto com as variáveis
}
