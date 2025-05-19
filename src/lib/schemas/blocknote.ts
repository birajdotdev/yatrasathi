import { type PartialBlock } from "@blocknote/core";
import { z } from "zod";

export const blockNoteBlockSchema = z.custom<PartialBlock>();
export const blockNoteDocumentSchema = z.array(blockNoteBlockSchema);
