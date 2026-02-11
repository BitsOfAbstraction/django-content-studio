import {
  PiCaretLeftBold,
  PiCaretRightBold,
  PiDotsThreeBold,
} from "react-icons/pi";
import ReactPaginate from "react-paginate";

import { Button, buttonVariants } from "@/components/ui/button";

function Pagination({
  current,
  pages,
  onPageChange,
}: {
  current: number;
  pages: number;
  onPageChange(page: number): void;
}) {
  return (
    pages > 1 && (
      <ReactPaginate
        forcePage={current - 1}
        pageCount={pages}
        onPageChange={({ selected }) => onPageChange(selected + 1)}
        pageRangeDisplayed={2}
        marginPagesDisplayed={3}
        renderOnZeroPageCount={null}
        className="flex items-center gap-2"
        activeLinkClassName={buttonVariants({
          variant: "secondary",
          size: "icon",
        })}
        pageLinkClassName={buttonVariants({ variant: "ghost", size: "icon" })}
        breakLabel={
          <Button variant="ghost" size="icon">
            <PiDotsThreeBold />
          </Button>
        }
        previousLabel={
          <Button variant="ghost" size="icon">
            <PiCaretLeftBold className="size-3" />
          </Button>
        }
        nextLabel={
          <Button variant="ghost" size="icon">
            <PiCaretRightBold className="size-3" />
          </Button>
        }
      />
    )
  );
}

export { Pagination };
