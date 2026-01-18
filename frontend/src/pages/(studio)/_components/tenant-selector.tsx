import * as R from "ramda";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDiscover } from "@/hooks/use-discover";
import { useTenant } from "@/tenant";

export function TenantSelector() {
  const { tenant, tenants, setTenant } = useTenant();
  const { data: discover } = useDiscover();
  const navigate = useNavigate();
  const tenantModel = discover?.models.find(
    R.whereEq({ label: discover?.multitenancy.tenant_model }),
  );
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Avatar className="size-4">
            <AvatarFallback>{tenant?.__str__[0]}</AvatarFallback>
          </Avatar>
          <span>{tenant?.__str__}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="right" align="start">
        <Command>
          <CommandInput />
          <CommandList>
            <CommandGroup>
              {tenants.map((tenant) => (
                <CommandItem
                  key={tenant.id}
                  value={tenant.id}
                  keywords={[tenant.__str__]}
                  onSelect={(value) => {
                    setTenant(value);
                    window.location.reload();
                  }}
                >
                  {tenant.__str__}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {tenantModel?.admin.permissions.add_permission && (
          <div className="border-t p-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate({ hash: `editor:${tenantModel.label}` })}
            >
              {t("tenant.selector.add")}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
