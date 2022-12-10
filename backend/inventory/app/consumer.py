import pickle
import time
import crud
import database
import schemas

KEY = 'complete_order'
GROUP = 'inventory_group'


def process_request(fields: dict) -> list[schemas.GoodIn]:
    fields = pickle.loads(bytes(fields.get('pickle'), 'latin-1'))

    order_id = fields.get('order_id')
    goods = fields.get('goods')

    print('order_id:', order_id)
    print('goods:', goods)

    updated_goods = []

    for good in goods:
        good_id = good.get('good_id')
        count = good.get('count')

        good_model = crud.get_good_by_id(session=next(database.get_session()), good_id=good_id)

        if good_model is not None and good_model.count >= count:
            updated_goods.append(schemas.GoodIn(
                id=good_id,
                count=good_model.count - count
            ))
        else:
            print('send message to payment service')

            database.redis.xadd(
                name='refund_order',
                fields={'order_id': order_id}
            )

            return []

    return updated_goods


def main():
    if database.redis.exists(KEY) == 0:
        database.redis.xgroup_create(name=KEY, groupname=GROUP, mkstream=True)

    while True:
        time.sleep(1)

        results = database.redis.xreadgroup(groupname=GROUP, consumername=KEY, streams={KEY: '>'})  # '>' - all events

        print('results:', results)

        if not results:
            continue

        for result in results:
            fields = result[1][0][1]
            updated_goods = process_request(fields)

            if not updated_goods:
                continue

            for updated_good in updated_goods:
                crud.update_good(session=database.get_session(), updated_good=updated_good)


if __name__ == '__main__':
    main()
